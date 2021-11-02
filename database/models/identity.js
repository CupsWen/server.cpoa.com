'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class identity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  identity.init({
    idCard: DataTypes.CHAR(18),
    phoneNumber: DataTypes.CHAR(11),
    userName: DataTypes.CHAR(20),
    userAddress: DataTypes.CHAR(20),
    publicKey: DataTypes.CHAR(181)
  }, {
    sequelize,
    modelName: 'identity',
  });
  return identity;
};
