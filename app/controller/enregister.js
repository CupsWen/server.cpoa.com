'use strict';

const md5 = require("md5");
const https = require('https');
const querystring = require('querystring');
/**
 *  Fabric
 * **/
const fs = require("fs");
const path = require("path");
const config = require('./config.json');
const { FileSystemWallet, Gateway} = require("fabric-network");

const Controller = require('egg').Controller;

/**
 *  共用参数
 * **/
let isDone = 1;
let rows = [];

class enregisterController extends Controller {
  async enregister() {
    const {ctx} = this;
    let {workHash, email,  publicKey, workAddress, workName, workDescribe} = ctx.request.body;
    console.log("\n");
    console.log(workHash, email,  publicKey, workAddress, workName, workDescribe);

    /**
     *  原创性检测
     * **/
    let bitmap = fs.readFileSync('static/image/'+workHash+'.png');
    let base64Img = new Buffer(bitmap).toString('base64');

    let dataJson = {
      workInfo: {
        workHash: workHash,
        publicKey: publicKey,
        workName: workName,
        workDescribe:workDescribe,
        workAddress:workAddress,
        image:base64Img
      },
      testResultList:[]
    }

    // 1. 数据项查重
    const work = await ctx.model.Work.findOne({
      workHash: workHash
    });
    if (work){
      ctx.body = {
        data: "作品已存在"
      }
    }

    // 2. 原创性检测
    let index = 0;
    const testResultA = await sendRequest(config.ods_cpoa_com, config.ods_cpoa_com_port, '/imageDetection', 'POST', dataJson.workInfo);
    if (testResultA.statusCode == 200){
      index += 1;
      dataJson.testResultList[0] = testResultA.data;
    }
    const testResultB = await sendRequest(config.ods_cpob_com, config.ods_cpob_com_port, '/imageDetection', 'POST', dataJson.workInfo);
    if (testResultB.statusCode == 200){
      index += 1;
      dataJson.testResultList[1] = testResultA.data;
    }
    const testResultC = await sendRequest(config.ods_cpoc_com, config.ods_cpoc_com_port, '/imageDetection', 'POST', dataJson.workInfo);
    if (testResultC.statusCode == 200){
      index += 1;
      dataJson.testResultList[2] = testResultC.data;
    }
    if (index !== 3){
      ctx.body = {
        data: "原创性检测不通过"
      }
    }
    console.log(dataJson.workInfo);
    console.log(dataJson.testResultList);

    // 3. Fabric交易
    // 3.1 相关文件
    const ccpPath = path.resolve("connection_file", "connection-cpoa.json");
    const walletPath = path.resolve("certificate");
    const wallet = new FileSystemWallet(walletPath);

    // 3.2 创建Gateway对象
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet: wallet, identity: "user1@cpoa.com", discovery: { enabled: true, asLocalhost: false} });
    const network = await gateway.getNetwork("mychannel");
    const channel = await network.getChannel();
    const contract = network.getContract("register");

    // 3.3 配置通道文件
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')).peers;
    const fabric_client = await gateway.getClient();
    channel.removePeer(channel.getPeers()[0]);
    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpoa.com"]["url"], {pem:ccp["peer0.cpoa.com"]["tlsCACerts"]["pem"]}), "CPOAMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpob.com"]["url"], {pem:ccp["peer0.cpob.com"]["tlsCACerts"]["pem"]}), "CPOBMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpoc.com"]["url"], {pem:ccp["peer0.cpoc.com"]["tlsCACerts"]["pem"]}), "CPOCMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.jo.com"]["url"], {pem:ccp["peer0.jo.com"]["tlsCACerts"]["pem"]}), "JOMSP");

    // 3.4 交易提案 ====>>>> 提案响应
    const transactionID = fabric_client.newTransactionID(true);
    const proposalObj = {
      targets: channel.getChannelPeers(),
      chaincodeId: "register",
      chaincodeVersion: "1.0",
      chaincodeType: "golang",
      txId: transactionID,
      fcn: "register",
      args: [JSON.stringify(dataJson)]
    };
    const proposalRes = await channel.sendTransactionProposal(proposalObj);

    // 3.6 交易请求 ====>>>> 交易结果
    const data = await channel.sendTransaction({
      proposalResponses: proposalRes[0],
      proposal: proposalRes[1]
    });
    console.log("transactionID", transactionID["_transaction_id"]);
    console.log(byteToString(proposalRes[0][0]["response"]["payload"]));

    // await ctx.model.Work.create({
    //   workHash:workHash,
    //   email:email,
    //   publicKey:publicKey,
    //   workAddress:workAddress,
    //   workName:workName,
    //   workDescribe:workDescribe
    // });
    // console.log(dataJson.workInfo);
  }
}
async function main(){
  const dataJson = {};
  const result = await enregisterWork("user1@cpoa.com",[JSON.stringify(dataJson)]);
}

main();

function sendRequest(host='localHost', port = 9000, path='/', method='GET', data={message:'hello'}){
  return new Promise((resolve, reject) => {
    let message = querystring.stringify(data);
    // console.log(message.length);
    const options = {
      host: host,                             // ip
      port: port,                      // 端口
      path: path,
      method: method,
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':message.length
      },
      key: config.testPrivateKey,             // 私钥
      cert: config.testPublicKey,             // 公钥
      ca: config.caCertificateList[0],        // 为服务器颁发证书的CA列表
      agent: false,                           // 不使用代理
      rejectUnauthorized: false               // 双向认证
    };

    let req = https.request(options, (res) => {
      // console.log('client connected', res.connection.authorized ? 'authorized' : 'unauthorized');
      let statusCode = res.statusCode;
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({statusCode, data});
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.write(message);
    req.end();
  })
}

async function enregisterWork(userId, args) {
  try{
    // 相关文件
    const ccpPath = path.resolve(__dirname, "connection_file", "connection-cpoa.json");
    const walletPath = path.resolve(__dirname, "certificate");
    const wallet = new FileSystemWallet(walletPath);

    // 判断证书是否存在
    const userExists = await wallet.exists(userId);
    if (!userExists) {
      return {code:400, data:userId+"not exists!"}
    }

    // 创建Gateway对象
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet: wallet, identity: userId, discovery: { enabled: true, asLocalhost: false} });
    const network = await gateway.getNetwork("mychannel");
    const channel = await network.getChannel();
    const contract = network.getContract("register");

    // 连接文件中的证书
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')).peers;
    const fabric_client = await gateway.getClient();
    channel.removePeer(channel.getPeers()[0]);

    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpoa.com"]["url"], {pem:ccp["peer0.cpoa.com"]["tlsCACerts"]["pem"]}), "CPOAMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpob.com"]["url"], {pem:ccp["peer0.cpob.com"]["tlsCACerts"]["pem"]}), "CPOBMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.cpoc.com"]["url"], {pem:ccp["peer0.cpoc.com"]["tlsCACerts"]["pem"]}), "CPOCMSP");
    channel.addPeer(fabric_client.newPeer(ccp["peer0.jo.com"]["url"], {pem:ccp["peer0.jo.com"]["tlsCACerts"]["pem"]}), "JOMSP");

    const transactionID = fabric_client.newTransactionID(true);
    const proposalObj = {
      targets: channel.getChannelPeers(),
      chaincodeId: "register",
      chaincodeVersion: "1.0",
      chaincodeType: "golang",
      txId: transactionID,
      fcn: "register",
      args: args
    };
    const proposalRes = await channel.sendTransactionProposal(proposalObj);
    var data = await channel.sendTransaction({
      proposalResponses: proposalRes[0],
      proposal: proposalRes[1]
    });
    console.log(byteToString(proposalRes[0][0]["response"]["payload"]))
    if (data["status"] == 'SUCCESS'){
      return {code:200, data:transactionID["_transaction_id"]};
    }
  }catch (e) {
    console.log(e);
    return {code:400, data:e.toString()};
  }
}

function byteToString(arr)
{
  if(typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for(var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if(v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for(var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

/**
 * 等待函数
 * **/
async function wait() {
  while (true){
    await sleep();
    if (isDone==1){break}
  }
}

async function sleep(time = 10) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}
module.exports = enregisterController;
