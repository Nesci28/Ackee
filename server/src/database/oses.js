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
  if (id) {
    match.$match.domainId = id;
  }
  if (dateFrom && dateTo) {
    match.$match.updated = {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    };
  }

  const group = {
    $group: {
      _id: {
        osName: '$osName',
      },
      count: {
        $sum: 1,
      },
    },
  };
  if (!id) {
    group.$group._id.domainId = '$domainId';
  }

  return Record.aggregate([match, group]);
};

const get = async (id, dateFrom, dateTo) => {
  return getTop(id, dateFrom, dateTo);
};

module.exports = {
  get,
};
