'use strict';

const pages = require('../database/pages');

const response = entry => ({
  type: 'page',
  data: {
    id: entry._id,
    count: entry.count,
    created: entry.created,
  },
});

const responses = entries => ({
  type: 'pages',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;

  const entries = await pages.get(domainId);
  return responses(entries);
};

module.exports = {
  get,
};
