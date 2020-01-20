'use strict';

const languages = require('../database/languages');

const response = entry => ({
  type: 'language',
  data: {
    id: entry._id.site,
    domainId: entry._id.domainId,
    count: entry.count,
  },
});

const responses = entries => ({
  type: 'languages',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;
  const { dateFrom, dateTo } = req.query;

  const entries = await languages.get(domainId, dateFrom, dateTo);

  return responses(entries);
};

module.exports = {
  get,
};
