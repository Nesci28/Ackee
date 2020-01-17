'use strict';

const { createError, json, send } = require('micro');

const durations = require('../database/durations');

const {
  DURATIONS_TYPE_AVERAGE,
  DURATIONS_TYPE_DETAILED,
} = require('../constants/durations');

const response = entry => ({
  type: 'duration',
  data: {
    id: {
      day: entry._id.day,
      month: entry._id.month,
      year: entry._id.year,
      hour: entry._id.hour,
    },
    domainId: entry._id.domainId,
    time: entry._id.time,
    average: Math.round(entry.average) ? Math.round(entry.average) : undefined,
    count: entry.count,
  },
});

const responses = entries => ({
  type: 'durations',
  data: entries.map(response),
});

const get = async req => {
  const { domainId } = req.params;
  const { type, dateFrom, dateTo } = req.query;

  const entries = await durations.get(domainId, type, dateFrom, dateTo);

  switch (type) {
    case DURATIONS_TYPE_AVERAGE:
      return responses(entries);
    case DURATIONS_TYPE_DETAILED:
      return responses(entries);
    default:
      throw createError(400, 'Unknown type');
  }
};

const getAll = async (req, res) => {
  const { type, dateFrom, dateTo } = req.query;
  const data = await json(req);

  const entries = [];
  await asyncForEach(data.domainsIds, async domainId => {
    entries.push(
      ...(await durations.get(domainId, type, dateFrom, dateTo, true)),
    );
  });

  return send(res, 201, responses(entries));
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  get,
  getAll,
};
