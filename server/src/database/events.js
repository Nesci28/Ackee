'use strict';

const Record = require('../schemas/Record');

const getTop = async id => {
  return Record.aggregate([
    {
      $match: {
        domainId: id,
        'eventsTriggered.0.group': { $exists: true },
        'eventsTriggered.0.name': { $exists: true },
      },
    },
    {
      $group: {
        _id: '$$ROOT.eventsTriggered',
      },
    },
  ]);
};

const get = async id => {
  return getTop(id);
};

module.exports = {
  get,
};
