const { Dial } = require('../models');
const { Op } = require('sequelize'); // Make sure to require Op from sequelize

// TODO: add chosen library
// const joblib = require('joblib');
// const tf = require('@tensorflow/tfjs-node');

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
      const dpd = req.body.DPD;
      const avgHandlingTime = await DialController.calculateAvgAgentHandlingTime(agent_id);

      if (avgHandlingTime == -1) {
        throw {
          statusCode: 404
        };
      }

      // TODO: Pick the model type and uncomment based on the chosen type

      // // Tf model
      // const model = await tf.loadLayersModel('path_to_your_model/model.json');

      // // Ubah fitur-fitur masukan ke dalam bentuk tensor TensorFlow
      // const input = tf.tensor2d([[agent_id, dpd]]); // Ubah sesuai dengan format masukan yang diterima oleh model
    
      // // Lakukan prediksi menggunakan model
      // const prediction = model.predict(input);
    
      // // Ambil hasil prediksi dan ubah menjadi nilai yang dapat dibaca
      // const handlingTime = prediction.dataSync()[0]; // Ubah sesuai dengan format hasil prediksi yang diinginkan
    
      // // Hapus tensor yang tidak digunakan lagi
      // tf.dispose(input);
      // tf.dispose(prediction);    


      // // Scikit model
      // const model = joblib.load('path_to_your_model/model.pkl');
      // const inputFeatures = [[agent_id, dpd]]; // Ubah sesuai dengan format masukan yang diterima oleh model
      // const prediction = model.predict(inputFeatures); // Lakukan prediksi

      // const handlingTime = prediction[0]; // Ubah sesuai dengan format hasil prediksi yang diinginkan

      res.status(200).json({
        STATUS: "SUCCESS",
        AGENT_ID: agent_id,
        
        // TODO: Change the output with proper handlingTime
        // "NEXT HANDLING TIME PREDICTION": handlingTime,
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