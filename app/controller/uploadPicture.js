'use strict';

// const fs = require('node/fs');
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
const md5 = require('md5');

const Controller = require('egg').Controller;

class uploadPictureController extends Controller {
  async post() {
    const { ctx } = this;

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
    ctx.body = {
      workHash: workHash
    };
  }
}

module.exports = uploadPictureController;
