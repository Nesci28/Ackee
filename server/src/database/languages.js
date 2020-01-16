'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      siteLanguage: {
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
        _id: '$siteLanguage',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
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
