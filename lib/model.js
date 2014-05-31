var _ = require('lodash'),
    uuid = require('node-uuid');

/**
 * Generic Model
 * @class
 * @name Model
 * @param [data] {object} - Seed data for the collection.
 */
module.exports = Model = function(data) {
  this.data = data || [];
};

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
 * Gets a collection of data. The results are cloned to prevent direct
 * modification of the items stored in the memory.
 * @memberof Model
 * @param query {object} - A key/value filter for the data.
 * @param options {object} - Various options to take into account when
 * returning the data.
 * @param callback {function(error, data)} - A callback to call when the
 * query has been run.
 */
Model.prototype.read = function(query, options, callback) {
  if(typeof query === 'function') {
    return query(null, this.data);
  }

  if(typeof options !== 'function') {
    var items = _.where(this.data, query);

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

    callback(null, _.cloneDeep(items));
  } else {
    options(null, _.cloneDeep(_.where(this.data, query)));
  }
};

/**
 * Adds an object to the data set.
 * @param item {object} - The object to add.
 * @memberof Model
 * @param callback {function(error, item)} - The callback to call when the
 * data has been added.
 */
Model.prototype.create = function(item, callback) {
  item.id = uuid.v4();
  this.data.push(item);
  callback(null, _.cloneDeep(item));
};

/**
 * Updates a single record with new values.
 * @memberof Model
 * @param item {object} - The updates. Must include the Id.
 * @param callback {function(error, item)} - The callback to call when
 * the udpates complete.
 */
Model.prototype.update = function(item, callback) {
  var it = _.where(this.data, {id:item.id});

  if(it && it.length > 0) {
    for(var p in item) {
      it[0][p] = item[p];
    }
  }

  callback(null, _.cloneDeep(it));
};

/**
 * Removes an item from the data set.
 * @param id {string} - The Id of the item to remove.
 * @param callback {function(error)} - The callback to call when the item
 * is removed.
 */
Model.prototype.delete = function(id, callback) {
  this.data = _.filter(this.data, function(item) {
    return item.id !== id;
  });

  callback(null);
};
