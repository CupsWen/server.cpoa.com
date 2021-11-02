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
      is_authenticated: {
        type: Sequelize.INTEGER(1)
      },
      id_card: {
        type: Sequelize.CHAR(18)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
