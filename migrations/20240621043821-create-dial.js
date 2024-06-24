'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dials', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      account_no: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      dpd: {
        type: Sequelize.INTEGER
      },
      agent_id: {
        type: Sequelize.STRING
      },
      action_code: {
        type: Sequelize.STRING
      },
      bucket: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    const fs = require('fs');
    const path = require('path');
    const sqlFilePath = path.join(__dirname, 'call_history.sql');
    const sqlData = await fs.promises.readFile(sqlFilePath, 'utf8');
    const rows = sqlData.split('\n')
      .filter(row => !row.startsWith('/*!'))
      .filter(row => row.trim() !== '')
      .map(row => row.trim());

    const dialData = rows.map(row => {
      const [account_no, start_time, end_time, dpd, agent_id, action_code, bucket] = row.split(',');
      return {
        account_no,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        dpd: parseInt(dpd),
        agent_id,
        action_code,
        bucket,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Dials', dialData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dials');
  }
};