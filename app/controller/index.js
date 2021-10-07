'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async showPage() {
        const {ctx} = this;
        await ctx.render('index', {title:'基于区块链的摄影作品版权保护系统', message:'index界面'});
    }
}
module.exports = IndexController;
