'use strict';

const micro = require('micro');
const { send, createError } = require('micro');
const { router, get, post, put, patch, del } = require('microrouter');

const signale = require('./utils/signale');
const pipe = require('./utils/pipe');
const isDefined = require('./utils/isDefined');
const customTrackerUrl = require('./utils/customTrackerUrl');
const requireAuth = require('./middlewares/requireAuth');
const blockDemo = require('./middlewares/blockDemo');
const ui = require('./routes/ui');
const tokens = require('./routes/tokens');
const domains = require('./routes/domains');
const records = require('./routes/records');
const views = require('./routes/views');
const pages = require('./routes/pages');
const referrers = require('./routes/referrers');
const languages = require('./routes/languages');
const durations = require('./routes/durations');

const catchError = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    const isUnknownError = err.statusCode == null;
    const hasOriginalError = err.originalError != null;

    // Only log the full error stack when the error isn't a known API response
    if (isUnknownError === true) {
      signale.fatal(err);
      return send(res, 500, err.message);
    }

    signale.warn(
      hasOriginalError === true ? err.originalError.message : err.message,
    );
    send(res, err.statusCode, err.message);
  }
};

// CORS
const originsString = process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
const attachCORSHeaders = fn => async (req, res) => {
  if (!originsString) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const allowedOrigins = originsString.split(';');
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,OPTIONS,PATCH',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization',
  );
  return await fn(req, res);
};

const notFound = async req => {
  const err = new Error(`\`${req.url}\` not found`);

  throw createError(404, 'Not found', err);
};

const routes = [
  get('/tracker.js', ui.tracker),
  get('/getTrackerName', ui.getTrackerName),
  customTrackerUrl != null ? get(customTrackerUrl, ui.tracker) : undefined,

  post('/tokens', tokens.add),
  del('/tokens/:tokenId', tokens.del),

  post('/domains', pipe(requireAuth, blockDemo, domains.add)),
  get('/domains', pipe(requireAuth, domains.all)),
  put('/domains/:domainId', pipe(requireAuth, blockDemo, domains.update)),
  del('/domains/:domainId', pipe(requireAuth, blockDemo, domains.del)),

  post('/domains/:domainId/records', records.add),
  patch('/domains/:domainId/records/:recordId', records.update),

  get('/domains/:domainId/views', pipe(requireAuth, views.get)),

  get('/domains/:domainId/pages', pipe(requireAuth, pages.get)),

  get('/domains/:domainId/referrers', pipe(requireAuth, referrers.get)),

  get('/domains/:domainId/languages', pipe(requireAuth, languages.get)),

  get('/domains/:domainId/durations', pipe(requireAuth, durations.get)),

  get('/*', notFound),
  post('/*', notFound),
  put('/*', notFound),
  patch('/*', notFound),
  del('/*', notFound),
].filter(isDefined);

module.exports = micro(attachCORSHeaders(catchError(router(...routes))));
