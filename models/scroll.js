module.exports = function(data) {
  var _ = require('lodash'),
      uuid = require('node-uuid');

  /**
   * Helper for sorting items by a given property, and type if a special type.
   * @param items {collection} - The items to be sorted.
   * @param prop {string} - The name of the property to sort on.
   * @param type {string} - The expected object type of the value to be sorted.
   * Current special types are: date.
   */
  var sort = function(items, prop, type) {
    if(typeof type == 'string' && type.toLowerCase() === 'date') {
      return _.sortBy(items, function(item) {
        return new Date(item[prop]).getTime();
      });
    }

    return _.sort(items, prop);
  };

  /**
   * Gets a collection of scrolls.
   * @param query {object} - A key/value filter for the data.
   * @param options {object} - Various options to take into account when
   * returning the data.
   * @param callback {function(error, data)} - A callback to call when the
   * query has been run.
   */
  var read = function(query, options, callback) {
    if(typeof options !== 'function') {
      var items = _.where(data.scrolls, query);

      if(options.order && options.order.field) {
        var type = 'notdate';

        if(options.order.field === 'created') {
          type = 'date';
        }

        items = sort(items, options.order.field, type);

        if(options.order.desc) {
          items.reverse();
        }
      }

      if(typeof options.offset === 'number') {
        if(options.offset > 1) {
          items = items.slice(options.offset - 1);
        }
      }

      if(typeof options.limit === 'number') {
        if(items.length > options.limit) {
          items = items.slice(0, options.limit);
        }
      }

      callback(null, items);
    } else {
      options(null, _.where(data.scrolls, query));
    }
  };

  /**
   * Adds a scroll to the data set.
   * @param scroll {object} - The scroll to add.
   * @param callback {function(error, scroll)} - The callback to call when the
   * scroll has been added.
   */
  var create = function(scroll, callback) {
    read({slug:scroll.slug}, function(err, scrolls) {
      if(err) {
        return callback(err, null);
      }

      if(scrolls.length > 0) {
        return callback({id:'VALIDATION_ERROR',message:''}, null);
      }

      scroll.id = uuid.v4();
      data.scrolls.push(scroll);
      callback(null, scroll);
    });
  };

  /**
   * Updates a single scroll with new values.
   * @param scroll {object} - The updates. Must include the Id for updating.
   * @param callback {function(error, count)} - The callback to call when
   * the udpates complete.
   *
   * TODO: If the query is by Id then one scroll is ever updated.
   */
  var update = function(scroll, callback) {
    var items = _.where(data.scrolls, {id:scroll.id});

    items.forEach(function(item) {
      for(var p in scroll) {
        item[p] = scroll[p];
      }
    });

    callback(null, items.length);
  };

  /**
   * Removes a scroll from the data set.
   * @param id {string} - The Id of the scroll to remove.
   * @param callback {function(error)} - The callback to call when the scroll
   * is removed.
   */
  var remove = function(id, callback) {
    data.scrolls = _.filter(data.scrolls, function(item) {
      return item.id !== id;
    });

    callback(null);
  };

  // Return a CRUD interface.
  return {
    create: create,
    read: read,
    update: update,
    delete: remove
  };
};
