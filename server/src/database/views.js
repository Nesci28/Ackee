'use strict';

const Record = require('../schemas/Record');

const {
  VIEWS_TYPE_UNIQUE,
  VIEWS_TYPE_TOTAL,
  VIEWS_TYPE_TIME,
} = require('../constants/views');

const getUnique = async (id, dateFrom, dateTo) => {
  const match = {
    $match: {
      clientId: {
        $exists: true,
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
          day: {
            $dayOfMonth: '$created',
          },
          month: {
            $month: '$created',
          },
          year: {
            $year: '$created',
          },
          domainId: '$domainId',
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

const getTotal = async (id, dateFrom, dateTo) => {
  const match = { $match: {} };
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
          day: {
            $dayOfMonth: '$created',
          },
          month: {
            $month: '$created',
          },
          year: {
            $year: '$created',
          },
          domainId: '$domainId',
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

const getTime = async (id, dateFrom, dateTo) => {
  const match = { $match: {} };
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
          domainId: '$domainId',
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
