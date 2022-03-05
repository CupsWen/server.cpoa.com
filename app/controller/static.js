'use strict';

// const fs = require('node/fs');
const fs = require('fs');
const Controller = require('egg').Controller;

class picController extends Controller {
    async get() {
        const {ctx} = this;
        const rawData = ctx.req.url.split("?")[1];
        const type = rawData.split("=")[0];
        const data = rawData.split("=")[1];
        console.log(ctx.req.url);
        if (type == "image"){
            ctx.set('content-type','image/jpeg')
            ctx.body = fs.readFileSync("static/pic/"+data);
        }
        if (type == "html"){
            ctx.response.type = "html";
            ctx.body = fs.readFileSync("static/html/"+data);
        }
    }
}
module.exports = picController;
