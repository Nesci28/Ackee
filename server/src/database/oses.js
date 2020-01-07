'use strict';

const Record = require('../schemas/Record');

const getTop = async id => {
  return Record.aggregate([
    {
      $match: {
        domainId: id,
        osName: {
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: '$osName',
        count: {
          $sum: 1,
        },
        created: { $push: '$$ROOT.created' },
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
