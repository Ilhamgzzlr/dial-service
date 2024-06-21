var faker = require('faker');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    var dummyJSON = [];

    for(var i =0 ; i<5000; i++){
      let agent_id = 'A' + String(i % 500 + 1).padStart(3, '0');
      const startTime = new Date(new Date().getTime() - (Math.floor(Math.random() * (24 * 60 * 60 * 1000))));
      let randomMinutes;
      do {
        randomMinutes = Math.floor(Math.random() * 10) + 1; 
      } while (randomMinutes === 0);
      const endTime = new Date(startTime.getTime() + randomMinutes * 60000);
      dummyJSON.push({
        agent_id :agent_id,
        start_time : startTime,
        end_time : endTime,
        action_code : faker.random.arrayElement(['ptp', 'promise', 'ppp']),
        dpd : faker.random.number({min: 30, max: 90}),
        createdAt : new Date(),
        updatedAt : new Date(),
      })
    }
    await queryInterface.bulkInsert('Dials', dummyJSON, {});
    

    // return queryInterface.bulkInsert('Dials', [
    //   {
    //     agent_id: 'A1101',
    //     start_time: new Date(),
    //     end_time: new Date(),
    //     action_code: 'ptp',
    //     dpd: 30,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Dials', null, {});
  }
};
