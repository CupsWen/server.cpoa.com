'use strict';

const crypto = require("crypto");
const constants = require('constants');
const Controller = require('egg').Controller;

class authenticationController extends Controller {
  async authentication() {
    const {ctx} = this;
    let {randomNumber, email, userName, idCard, publicKey, signature} = ctx.request.body;
    const verifyResult = publicDecrypt(signature, publicKey, 'hex', 'utf8');
    console.log(randomNumber, email, userName, idCard, publicKey, signature, verifyResult);
    if (verifyResult > 0){
      const identity = await ctx.model.Identity.findOne({
        idCard: idCard
      });
      if (identity){
        ctx.body = {
          data: "用户已认证"
        };
      }else {
        await ctx.model.Identity.create({
          idCard,
          userName,
          publicKey
        });
        const user = ctx.model.User.findOne({
          email:email
        });
        await user.update({
          isAuthenticated: 1,
          idCard:idCard
        });
        ctx.body = {
          data: "实名认证成功"
        };
      }
    }

    // const idCard = "410782199711011276";
    // const userName = "文家";
    // const publicKey = "410782199711011276";
    // await ctx.model.Identity.create({
    //       idCard,
    //       userName,
    //       publicKey
    // });
  }
}

/**
 * @description
 * 公钥解密数据
 * @param {*} data 待解密数据
 * @param {*} publicKey 公钥
 * @param {*} inputEncoding 解密数据类型
 * @param {*} outputEncoding 输出的数据类型
 * @param {*} padding 填充方式
 * @returns
 */
function publicDecrypt(data, publicKey, inputEncoding, outputEncoding, padding) {
  var decryptText = '';
  decryptText = crypto.publicDecrypt({
    key: publicKey,
    padding: padding || constants.RSA_PKCS1_PADDING
  }, Buffer.from(data, inputEncoding));
  return decryptText.toString(outputEncoding);
}

module.exports = authenticationController;
