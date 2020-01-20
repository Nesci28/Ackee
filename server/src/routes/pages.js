'use strict';

const pages = require('../database/pages');

const responses = entries => ({
  type: 'pages',
  data: categorizeEntries(entries),
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

function categorizeEntries(entries, res = []) {
  const domainIds = [...new Set(entries.map(entry => entry.domainId))];

  domainIds.forEach(domainId => {
    const domainEntries = entries.filter(entry => entry.domainId === domainId);
    const pageList = [].concat.apply(
      [],
      domainEntries.map(entry => entry.pagesVisited),
    );

    const tempArr = [];
    [...new Set(pageList)].forEach(page => {
      tempArr.push({
        page,
        count: pageList.filter(e => e === page).length,
      });
    });

    res.push({
      domainId,
      siteLocation: new URL(domainEntries[0].siteLocation).origin,
      data: tempArr,
    });
  });

  return res;
}
