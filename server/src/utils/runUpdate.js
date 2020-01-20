'use strict';

module.exports = (schema, id, data = {}, props = []) => {
  const _set = {};
  const eventsTriggered = data.eventsTriggered || [];
  const pagesVisited = data.pagesVisited || [];
  delete data.eventsTriggered;
  delete data.pagesVisited;

  Object.keys(data).forEach(key => {
    // Check if it's allowed to change key
    if (props.includes(key) === false) return;

    _set[key] = data[key];
  });

  let query = {
    id: {
      id,
    },
    set: {
      $set: {
        ..._set,
        updated: Date.now(),
      },
      $push: {},
    },
    new: {
      new: true,
    },
  };

  if (eventsTriggered.length > 0) {
    query.set.$push.eventsTriggered = [...eventsTriggered];
  }
  if (pagesVisited.length > 0) {
    query.set.$push.pagesVisited = [...pagesVisited];
  }

  return schema.findOneAndUpdate(query.id, query.set, query.new);
};
