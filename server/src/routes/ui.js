'use strict';

const { send } = require('micro');
const { readFile } = require('fs').promises;

const isProductionEnv = require('../utils/isProductionEnv');

const getTrackerName = () => {
  const statusCode = 200;
  const data = { name: process.env.ACKEE_TRACKER || 'tracker' };

  return async (req, res) => {
    send(res, statusCode, data);
  };
};

const tracker = () => {
  const filePath = require.resolve('../ackee-tracker.min.js');
  const data = readFile(filePath, 'utf8');

  return async (req, res) => {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.end(await data);
  };
};

module.exports = {
  getTrackerName:
    isProductionEnv === true
      ? getTrackerName()
      : (req, res) => getTrackerName()(req, res),
  tracker:
    isProductionEnv === true ? tracker() : (req, res) => tracker()(req, res),
};
