const { Dial } = require('../models');
const { Op } = require('sequelize'); // Make sure to require Op from sequelize

class DialController {
  static async create(req, res, next) {
    try {
      const { START_TIME, END_TIME, AGENT_ID, DPD, ACTION_CODE } = req.body;

      await Dial.create({
        start_time: START_TIME,
        end_time: END_TIME,
        agent_id: AGENT_ID,
        dpd: DPD,
        action_code: ACTION_CODE
      });

      res.status(201).json({
        STATUS: "SUCCESS",
        MESSAGE: "Data Inserted Successfully",
      });
    } catch (err) {
      console.log(err, 'Invalid time');
      res.status(400).json({
        STATUS: "FAILED",
        MESSAGE: "Invalid time",
      });
      next(err);
    }
  }

  static async calculateAvgAgentHandlingTime(agent_id) {
    const dial = await Dial.findAll({
      where: {
        agent_id,
        start_time: {
          [Op.gte]: new Date(new Date() - 60 * 60 * 1000) // Start time within the last 1 hour
        }, 
      }
    });

    if (dial.length === 0) {
      return -1;
    }

    let totalHandlingTime = 0;
    for (let i = 0; i < dial.length; i++) {
      const { start_time, end_time } = dial[i];
      const handlingTime = new Date(end_time) - new Date(start_time);
      totalHandlingTime += handlingTime;
    }

    const avgHandlingTime = totalHandlingTime / dial.length;
    return avgHandlingTime * 1000; // Convert from milisecond to second
  }

  static async getAvgAgentHandlingTime(req, res, next) {
    try {
      const agent_id = req.params.agent_id;
      const avgHandlingTime = await DialController.calculateAvgAgentHandlingTime(agent_id);

      if (avgHandlingTime == -1) {
        throw {
          statusCode: 404
        };
      }

      res.status(200).json({
        STATUS: "SUCCESS",
        AGENT_ID: agent_id,
        "AVG HANDLING TIME": avgHandlingTime,
      });
    } catch (err) {
      if (err.statusCode === 404) {
        res.status(404).json({
          STATUS: "FAILED",
          MESSAGE: "Invalid AGENT",
        });
      } else {
        res.status(400).json({
          STATUS: "FAILED",
          MESSAGE: "ACTION NOT RECOGNIZED",
        });
      }
      next(err);
    }
  }

  static async findNextHandlingTimePrediction(req, res, next) {
    try {
      const agent_id = req.params.agent_id;
      const avgHandlingTime = await DialController.calculateAvgAgentHandlingTime(agent_id);

      if (avgHandlingTime == -1) {
        throw {
          statusCode: 404
        };
      }


      res.status(200).json({
        STATUS: "SUCCESS",
        AGENT_ID: agent_id,
        "NEXT HANDLING TIME PREDICTION": avgHandlingTime,
      });
    } catch (err) {
      if (err.statusCode === 404) {
        res.status(404).json({
          STATUS: "FAILED",
          MESSAGE: "Invalid AGENT",
        });
      } else {
        res.status(400).json({
          STATUS: "FAILED",
          MESSAGE: "ACTION NOT RECOGNIZED",
        });
      }
      next(err);
    }
  }
}

module.exports = DialController;