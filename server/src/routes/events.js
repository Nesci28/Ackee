'use strict';

const events = require('../database/events');

const response = entry => entry._id;

const responses = entries => ({
  type: 'events',
  data: categorizeEntries([].concat.apply([], entries.map(response))),
});

const get = async req => {
  const { domainId } = req.params;
  const { dateFrom, dateTo } = req.query;

  const entries = await events.get(domainId, dateFrom, dateTo);
  return responses(entries);
};

module.exports = {
  get,
};

function categorizeEntries(data, res = []) {
  const groupSet = new Set(data.map(x => x.group));
  groupSet.forEach(group => {
    res.push({
      groupName: group,
      events: data
        .filter(el => el.group === group)
        .reduce((accu, curr) => {
          accu[curr.name] = accu[curr.name] + 1 || 1;
          return accu;
        }, {}),
    });
  });
  return res;
}
