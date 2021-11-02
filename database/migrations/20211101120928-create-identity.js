'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('identities', {
      id_card: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(18)
      },
      phone_number: {
        type: Sequelize.CHAR(11)
      },
      user_name: {
        type: Sequelize.CHAR(20)
      },
      user_address: {
        type: Sequelize.CHAR(20)
      },
      public_key: {
        type: Sequelize.CHAR(181)
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
    await queryInterface.dropTable('identities');
  }
};
