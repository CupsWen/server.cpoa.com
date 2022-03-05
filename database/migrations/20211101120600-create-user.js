'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(32)
      },
      password: {
        type: Sequelize.CHAR(64)
      },
      isAuthenticated: {
        type: Sequelize.INTEGER(1)
      },
      idCard: {
        type: Sequelize.CHAR(18)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
