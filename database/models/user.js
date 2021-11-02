'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    email: DataTypes.CHAR(32),
    password: DataTypes.CHAR(64),
    isAuthenticated: DataTypes.INTEGER(1),
    idCard: DataTypes.CHAR(18)
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
