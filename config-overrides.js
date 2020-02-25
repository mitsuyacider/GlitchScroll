const path = require('path')
module.exports = function override(config, env) {
  config.resolve = {
    alias: {
      threelib:
        path.join(__dirname, "./src/libs")
    }
  };

  return config;
};
