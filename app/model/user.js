'use strict';

module.exports = app => {
  const { INTEGER, CHAR, DATE} = app.Sequelize;
  return app.model.define('user', {
    email: { allowNull:false, primaryKey: true, type: CHAR(32)},
    password: CHAR(64),
    isAuthenticated: INTEGER(1),
    idCard: CHAR(18),
    createdAt: DATE,
    updatedAt: DATE,
  });
};
