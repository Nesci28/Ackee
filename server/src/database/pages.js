'use strict';

const Record = require('../schemas/Record');

const getTop = async id => {
  return Record.aggregate([
    {
      $match: {
        domainId: id,
      },
    },
    {
      $group: {
        _id: '$siteLocation',
        count: {
          $sum: 1,
        },
        created: { $push: '$$ROOT.created' },
      },
    },
    {
      $sort: {
        count: -1,
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
