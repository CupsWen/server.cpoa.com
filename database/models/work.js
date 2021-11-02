'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class work extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  work.init({
    workHash: DataTypes.CHAR(64),
    publicKey: DataTypes.CHAR(181),
    phoneNumber: DataTypes.CHAR(11),
    workName: DataTypes.CHAR(20),
    workAddress: DataTypes.CHAR(20)
  }, {
    sequelize,
    modelName: 'work',
  });
  return work;
};
