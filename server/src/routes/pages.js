'use strict';

const pages = require('../database/pages');

const response = entry => ({
  type: 'page',
  data: {
    id: entry._id,
    count: entry.count,
  },
});

const responses = entries => ({
  type: 'pages',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;
  const { dateFrom, dateTo } = req.query;

  const entries = await pages.get(domainId, dateFrom, dateTo);
  return responses(entries);
};

module.exports = {
  get,
};
