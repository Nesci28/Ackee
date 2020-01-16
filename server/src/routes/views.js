'use strict';

const { createError } = require('micro');

const views = require('../database/views');

const {
  VIEWS_TYPE_UNIQUE,
  VIEWS_TYPE_TOTAL,
  VIEWS_TYPE_TIME,
} = require('../constants/views');

const response = entry => ({
  type: 'view',
  data: {
    id: {
      day: entry._id.day,
      month: entry._id.month,
      year: entry._id.year,
      hour: entry._id.hour,
      domain: entry._id.domainId,
    },
    count: entry.count,
  },
});

const responses = entries => ({
  type: 'views',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;
  const { type, dateFrom, dateTo } = req.query;

  const entries = await views.get(domainId, type, dateFrom, dateTo);

  switch (type) {
    case VIEWS_TYPE_UNIQUE:
      return responses(entries, type);
    case VIEWS_TYPE_TOTAL:
      return responses(entries, type);
    case VIEWS_TYPE_TIME:
      return responses(entries, type);
    default:
      throw createError(400, 'Unknown type');
  }
};

module.exports = {
  get,
};
