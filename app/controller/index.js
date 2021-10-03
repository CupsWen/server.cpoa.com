'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async showPage() {
        const {ctx} = this;
        await ctx.render('index', {title:'摄影作品版权保护登记系统', message:'欢迎界面'});
    }
}
module.exports = IndexController;
