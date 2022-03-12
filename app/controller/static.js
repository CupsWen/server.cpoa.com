'use strict';

// const fs = require('node/fs');
const fs = require('fs');
const QueryString = require("querystring");
const Controller = require('egg').Controller;

class picController extends Controller {
    async get() {
        const {ctx} = this;

        // 1. 获取类型
        const rawData = ctx.req.url.split("?")[1];
        const type = rawData.split("&")[0].split("=")[0];
        console.log(ctx.req.url);
        if (type == "image"){
            ctx.set('content-type','image/jpeg')
            ctx.body = fs.readFileSync("static/pic/"+rawData.split("&")[0].split("=")[1]);
        }
        if (type == "html"){
            // ctx.response.type = "html";
            let html = fs.readFileSync("static/html/"+rawData.split("&")[0].split("=")[1],  "utf8");
            html = html.replace(new RegExp("<%=email%>","gm"), rawData.split("&")[1].split("=")[1]);
            console.log("static/html/"+rawData.split("&")[0].split("=")[1]);
            console.log(rawData.split("&")[1].split("=")[1]);
            ctx.body = html;
        }
    }
}
module.exports = picController;
