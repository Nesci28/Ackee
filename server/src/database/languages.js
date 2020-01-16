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
        site: '$siteLanguage',
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
