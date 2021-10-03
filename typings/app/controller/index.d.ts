// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportConsole = require('../../../app/controller/console');
import ExportHome = require('../../../app/controller/home');
import ExportIndex = require('../../../app/controller/index');
import ExportLogin = require('../../../app/controller/login');

declare module 'egg' {
  interface IController {
    console: ExportConsole;
    home: ExportHome;
    index: ExportIndex;
    login: ExportLogin;
  }
}
