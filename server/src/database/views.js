'use strict';

const Record = require('../schemas/Record');

const {
  VIEWS_TYPE_UNIQUE,
  VIEWS_TYPE_TOTAL,
  VIEWS_TYPE_TIME,
} = require('../constants/views');

const sort = {
  $sort: {
    '_id.year': -1,
    '_id.month': -1,
    '_id.day': -1,
  },
};

function getAggregateMatch(id, dateFrom, dateTo, unique) {
  const match = { $match: {} };
  if (unique) {
    match.$match.clientId = {
      $exists: true,
      $ne: null,
    };
  }
  if (id) {
    match.$match.domainId = id;
  }
  if (dateFrom && dateTo) {
    match.$match.updated = {
      $gte: new Date(dateFrom),
      $lte: new Date(dateTo),
    };
  }

  return match;
}

function getAggregatedGroup(id) {
  const group = {
    $group: {
      _id: {
        day: {
          $dayOfMonth: '$created',
        },
        month: {
          $month: '$created',
        },
        year: {
          $year: '$created',
        },
        hour: {
          $hour: '$created',
        },
      },
      count: {
        $sum: 1,
      },
    },
  };
  if (!id) {
    group.$group._id.domainId = '$domainId';
  }

  return group;
}

const getUnique = async (id, dateFrom, dateTo) => {
  return Record.aggregate([
    getAggregateMatch(id, dateFrom, dateTo, true),
    getAggregatedGroup(id),
    sort,
  ]);
};

const getTotal = async (id, dateFrom, dateTo) => {
  return Record.aggregate([
    getAggregateMatch(id, dateFrom, dateTo),
    getAggregatedGroup(id),
    sort,
  ]);
};

const getTime = async (id, dateFrom, dateTo) => {
  return Record.aggregate([
    getAggregateMatch(id, dateFrom, dateTo),
    getAggregatedGroup(id),
    sort,
  ]);
};

const get = async (id, type, dateFrom, dateTo) => {
  switch (type) {
    case VIEWS_TYPE_UNIQUE:
      return getUnique(id, dateFrom, dateTo);
    case VIEWS_TYPE_TOTAL:
      return getTotal(id, dateFrom, dateTo);
    case VIEWS_TYPE_TIME:
      return getTime(id, dateFrom, dateTo);
  }
};

module.exports = {
  get,
};
