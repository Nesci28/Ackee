'use strict';

const Record = require('../schemas/Record');

const getTop = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      'pagesVisited.0': { $type: 'string' },
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

  const group = {
    $group: {
      _id: '',
    },
  };
  if (!id) {
    group.$group._id = '$domainId';
  }

  const project = {
    $project: {
      _id: 0,
      pagesVisited: 1,
      siteLocation: 1,
    },
  };
  if (!id) {
    project.$project.domainId = 1;
  }

  return Record.aggregate([match, project]);
};

const get = async (id, dateFrom, dateTo) => {
  return getTop(id, dateFrom, dateTo);
};

module.exports = {
  get,
};
