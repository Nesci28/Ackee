'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      osName: {
        $ne: null,
      },
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
        _id: '$osName',
        count: {
          $sum: 1,
        },
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
