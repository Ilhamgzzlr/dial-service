'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agent_id: {
        type: Sequelize.STRING,
        null: false
      },
      start_time: {
        type: Sequelize.DATE,
        null: false
      },
      end_time: {
        type: Sequelize.DATE,
        null: false
      },
      action_code: {
        type: Sequelize.STRING,
        null: false
      },
      dpd: {
        type: Sequelize.INTEGER,
        null: false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dials');
  }
};