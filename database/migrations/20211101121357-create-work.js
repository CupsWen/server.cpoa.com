'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('works', {
      work_hash: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(64)
      },
      public_key: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(181)
      },
      phone_number: {
        type: Sequelize.CHAR(11)
      },
      work_name: {
        type: Sequelize.CHAR(20)
      },
      work_address: {
        type: Sequelize.CHAR(20)
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
    await queryInterface.dropTable('works');
  }
};
