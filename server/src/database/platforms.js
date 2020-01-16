'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      browserWidth: {
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
        _id: {
          $switch: {
            branches: [
              { case: { $gte: ['$browserWidth', 1200] }, then: 'X-large' },
              { case: { $gte: ['$browserWidth', 992] }, then: 'Large' },
              { case: { $gte: ['$browserWidth', 768] }, then: 'Medium' },
              { case: { $gte: ['$browserWidth', 576] }, then: 'Small' },
              { case: { $lt: ['$browserWidth', 576] }, then: 'X-small' },
            ],
          },
        },
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
