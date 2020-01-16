'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {},
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

  const group = {
    $group: {
      _id: {
        siteLocation: '$siteLocation',
      },
      count: {
        $sum: 1,
      },
    },
  };
  if (!id) {
    group.$group._id.domainId = '$domainId';
  }

  return Record.aggregate([
    match,
    group,
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
