'use strict';

const Controller = require('egg').Controller;

class ConsoleController extends Controller {
    async showPage() {
        const {ctx} = this;

        await ctx.render('console', {title:'基于区块链的摄影作品版权保护系统', message:'控制台'});
    }
}
module.exports = ConsoleController;
