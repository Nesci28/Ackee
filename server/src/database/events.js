'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      'eventsTriggered.0.group': { $exists: true },
      'eventsTriggered.0.name': { $exists: true },
    },
  };
  if (id !== undefined) {
    match.$match.domainId = id;
  }
  if (dateFrom !== undefined && dateTo !== undefined) {
    match.$match.updated = {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    };
  }
  return Record.aggregate([
    match,
    {
      $group: {
        _id: '$$ROOT.eventsTriggered',
      },
    },
  ]);
};

const get = async (id, dateFrom, dateTo) => {
  return getTop(id, dateFrom, dateTo);
};

module.exports = {
  get,
};
