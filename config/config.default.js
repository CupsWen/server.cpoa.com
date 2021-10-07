/* eslint valid-jsdoc: "off" */

'use strict';

const fs = require('fs');
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1633152783136_2541';

  // add your middleware config here
  config.middleware = [];

  // 配置图标
  config.siteFile = {
    '/favicon.ico': fs.readFileSync('favicon.png'),
  };

  // 配置静态资源
  config.static = {
    prefix: '/static', // 前缀
    dir: path.join(appInfo.baseDir, 'app/public'), // 路径
    dynamic: true, // 如果没有就加载到缓存中
    preload: false, // 预加载
    maxAge: 31536000, // 生存周期{in prod env, 0 in other envs}
    buffer: true, // 使用buffer缓存{in prod env, false in other envs}
  };

  // 配置模板引擎模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };
  // 不使用默认的CSRF防护
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // 配置模板引擎模板引擎
  config.secu = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.cors = {
    origin: '*', // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'server',
    password: '123456789',
  };

  // add your user config here
  const myConfig = {
    myAppName: 'egg',
  };
  // 配置监听端口
  myConfig.cluster = {
    listen: {
      path: '',
      port: 8000,
      hostname: 'localHost',
    },
  };

  return {
    ...config,
    ...myConfig,
  };
};
