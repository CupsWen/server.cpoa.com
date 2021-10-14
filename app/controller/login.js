'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    async showPage() {
        const {ctx} = this;
        await ctx.render('login', {title:'基于区块链的摄影作品版权保护系统', message:'欢迎界面'});
    }

    async login(){
        const {ctx} = this;
    }
}
module.exports = LoginController;
