'use strict';

const oses = require('../database/platforms');

const response = entry => ({
  id: {
    platform: entry._id,
  },
  count: entry.count,
});

const responses = entries => ({
  type: 'platforms',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;
  const { dateFrom, dateTo } = req.query;

  const entries = await oses.get(domainId, dateFrom, dateTo);

  return responses(entries);
};

module.exports = {
  get,
};
