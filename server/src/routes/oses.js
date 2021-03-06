'use strict';

const oses = require('../database/oses');

const response = entry => ({
  id: entry._id.osName,
  domainId: entry._id.domainId,
  count: entry.count,
});

const responses = entries => ({
  type: 'oses',
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
