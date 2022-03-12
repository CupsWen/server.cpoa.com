'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
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
      }
    });

    // 3. 核验密码
    if (user && user.dataValues.password === password) {
        // "<%=email%>"
        let html = fs.readFileSync("app/view/console.html",  "utf8");
        html = html.replace(new RegExp("<%=email%>","gm"),email);
        html = html.replace(new RegExp("<%=title%>","gm"), '基于区块链的摄影作品版权保护系统');
        html = html.replace(new RegExp("<%=message%>","gm"), '欢迎界面');
        ctx.body = html;
        // await ctx.render('console', { title: '基于区块链的摄影作品版权保护系统', message: '欢迎界面', email:email });
    }else {
      ctx.body = {code: 400, message: 'password error!'};
    }
  }
}
module.exports = LoginController;
