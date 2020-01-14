'use strict';

module.exports = (schema, id, eventsTriggered, data = {}, props = []) => {
  const _set = {};

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
    },
    new: {
      new: true,
    },
  };
  if (eventsTriggered) {
    query.set.$push = {
      eventsTriggered: {
        events: eventsTriggered,
        date: new Date(),
      },
    };
  }
  return schema.findOneAndUpdate(query.id, query.set, query.new);
};
