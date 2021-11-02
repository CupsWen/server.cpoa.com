'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async showPage() {
    const { ctx } = this;
    await ctx.render('login', { title: '基于区块链的摄影作品版权保护系统', message: '欢迎界面' });
  }

  async login() {
    const { ctx } = this;
    // 1. 获取数据
    let { email, password } = ctx.request.body;
    // 2. 查询password
    let user = await ctx.model.User.findOne({
      where: {
        email
      },
      attributes: [ 'password' ]
    });
    // 3. 核验密码
    if (user && user.dataValues.password === password) {
      await ctx.render('console', { title: '基于区块链的摄影作品版权保护系统', message: '欢迎界面' });
    }else {
      ctx.body = {code: 400, message: 'password error!'};
    }
  }
}
module.exports = LoginController;
