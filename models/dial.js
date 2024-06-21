'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dial.init({
    agent_id: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    action_code: DataTypes.STRING,
    dpd: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dial',
  });
  return Dial;
};