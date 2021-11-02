'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.index.showPage);
  router.get('/home', controller.home.showPage);
  router.get('/login', controller.login.showPage);
  router.post('/login', controller.login.login);
  router.get('/console', controller.console.showPage);
};
