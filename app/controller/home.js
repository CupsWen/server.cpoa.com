'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async showPage() {
        const {ctx} = this;
        await ctx.render('home', {title:'基于区块链的摄影作品版权保护系统', message:'欢迎界面'});
    }
}
module.exports = HomeController;
