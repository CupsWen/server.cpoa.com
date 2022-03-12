'use strict';

module.exports = app => {
  const { CHAR, DATE} = app.Sequelize;
  // workHash, publicKey, workAddress, workName, workDescribe
  return app.model.define('work', {
    workHash: { allowNull:false, primaryKey: true, type: CHAR(64)},
    publicKey: CHAR(181),
    email: CHAR(20),
    workAddress: CHAR(64),
    workName: CHAR(20),
    workDescribe: CHAR(200),
    transactionId: CHAR(64),
    createdAt: DATE,
    updatedAt: DATE,
  });
};
