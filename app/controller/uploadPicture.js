'use strict';

// const fs = require('node/fs');
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
const md5 = require('md5');
const crypto = require("crypto");
const constants = require('constants');
const shell = require("shelljs");

const Controller = require('egg').Controller;

class uploadPictureController extends Controller {
  async post() {
    const { ctx } = this;

    const email = ctx.request.url.split("?")[1].split("=")[1]

    // 1. 读取文件
    const stream = await ctx.getFileStream();

    // 2. 保存文件
    const target = path.join('static/image', 'hash.png');
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);

    // 3. 计算文件哈希值
    const bitmap = fs.readFileSync('static/image/hash.png');
    const base64Img = new Buffer(bitmap).toString('base64');
    const workHash = md5(base64Img);

    // 4. 移动文件
    fs.writeFileSync('static/image/' + workHash + '.png', fs.readFileSync('static/image/hash.png'));

    // 1. 查权限
    let user = await ctx.model.User.findOne({
      where: {
        email
      }
    });
    if (user && user.dataValues.isAuthenticated === 0) {
      return;
    }

    // 2. 查公钥
    if (user.dataValues.idCard === ""){
      return;
    }
    let identity = await ctx.model.Identity.findOne({
      where: {
        idCard: user.dataValues.idCard
      }
    });
    const publicKey = identity.dataValues.publicKey;

    // 3. 公钥加密
    const encryptBitmap = publicEncrypt(base64Img, publicKey, 'hex', 'utf8');
    const encryptBitmapHash = md5(encryptBitmap);
    fs.writeFileSync('static/image/encryptBitmap.png', encryptBitmap);

    // 4. 上传文件到IPFS
    const resutl = shell.exec("ipfs add static/image/encryptBitmap.png");
    if (resutl.code !== 0){
      shell.echo("Error: ipfs add failed.");
      shell.exit(1);
      return;
    }

    const workAddress = resutl.stdout.replace("\n", "").split(" ")[1];
    ctx.body = {
      workHash: workHash,
      publicKey: publicKey,
      workAddress: workAddress
    };
  }
}

/**
 * @description
 * 公钥加密数据
 * @param {*} data 待加密数据
 * @param {*} publicKey 公钥
 * @param {*} inputEncoding 加密数据类型
 * @param {*} outputEncoding 输出的数据类型
 * @param {*} padding 填充方式
 * @returns
 */
function publicEncrypt(data, publicKey, inputEncoding, outputEncoding, padding) {
  var encryptText = crypto.publicEncrypt({
    key: publicKey,
    padding: padding || constants.RSA_PKCS1_PADDING
  }, Buffer.from(data, inputEncoding));

  return encryptText.toString(outputEncoding);
}

module.exports = uploadPictureController;
