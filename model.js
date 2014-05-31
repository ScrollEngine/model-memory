var fs = require('fs'),
    path = require('path'),
    Model = require('./lib/model'),
    dataDir = '';
    models = {};

models.scroll = new Model(models);

/**
 * Loads in a JSON file of data.
 * @private
 * @param name {string} - The name of the file to search for.
 * @returns a JSON object or null if the file was not found.
 */
var getData = function(name) {
  if(dataDir.length > 0 && fs.existsSync(dataDir + name + '.json')) {
    return require(dataDir + name + '.json');
  }

  return [];
};

// return the connect function and models
module.exports = {
  /**
   * Loads in JSON data from disk and makes a successful "connection" for
   * the scroll server.
   * @param connectionString {string} - The location of JSON files to
   * load, if any.
   * @param connected {function()} - The callback to call when a successful
   * connection is made. This is always called for memory storage connections.
   * @param error {function(error)} - The callback to call when a
   * connection error has occured.
   */
  connect: function(connectionString, connected, error) {
    // define the data directory for test data
    if(typeof connectionString === 'string') {
      dataDir = path.resolve(connectionString);
    }

    dataDir += '/';

    // load the defined models
    for(var m in models) {
      models[m].data = getData(m);
    }

    connected();
  },

  // pass along the models
  models: models,

  /**
   * Loads a new model.
   * @parma name {string} - the name to give the model
   * @param model {function(models, context)} - The initialization function
   * to run.
   **/
  load: function(name, model) {
    models[name] = model(models, {
      Model: Model
    });
  }
};
