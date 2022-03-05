'use strict';

module.exports = app => {
  const { CHAR, DATE} = app.Sequelize;
  return app.model.define('identity', {
    idCard: { allowNull:false, primaryKey: true, type: CHAR(18)},
    phoneNumber: CHAR(11),
    userName: CHAR(8),
    userAddress: CHAR(18),
    publicKey: CHAR(100),
    createdAt: DATE,
    updatedAt: DATE,
  });
};
