'use strict';

const oses = require('../database/platforms');

const response = entry => ({
  id: {
    platform: entry._id,
  },
  count: entry.count,
  created: entry.created,
});

const responses = entries => ({
  type: 'platforms',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;

  const entries = await oses.get(domainId);

  return responses(entries);
};

module.exports = {
  get,
};
