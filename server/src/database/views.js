'use strict';

const Record = require('../schemas/Record');

const {
  VIEWS_TYPE_UNIQUE,
  VIEWS_TYPE_TOTAL,
  VIEWS_TYPE_TIME,
} = require('../constants/views');

const getUnique = async id => {
  return Record.aggregate([
    {
      $match: {
        clientId: {
          $exists: true,
          $ne: null,
        },
        domainId: id,
      },
    },
    {
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
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1,
        '_id.day': -1,
      },
    },
  ]);
};

const getTotal = async id => {
  return Record.aggregate([
    {
      $match: {
        domainId: id,
      },
    },
    {
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
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1,
        '_id.day': -1,
      },
    },
  ]);
};

const getTime = async id => {
  return Record.aggregate([
    {
      $match: {
        clientId: {
          $exists: true,
          $ne: null,
        },
        domainId: id,
      },
    },
    {
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
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1,
        '_id.day': -1,
      },
    },
  ]);
};

const get = async (id, type) => {
  switch (type) {
    case VIEWS_TYPE_UNIQUE:
      return getUnique(id);
    case VIEWS_TYPE_TOTAL:
      return getTotal(id);
    case VIEWS_TYPE_TIME:
      return getTime(id);
  }
};

module.exports = {
  get,
};
