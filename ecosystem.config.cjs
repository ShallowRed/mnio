const argv = require('minimist')(process.argv.slice(2));
const isDevMode = argv.env !== "production";

module.exports = {

  apps: {

    cwd: `${__dirname}`,

    script: './entry.cjs',

    watch: isDevMode && ['lib', 'shared'],

    watch_options: {
      followSymlinks: false
    },

    env: {
      // "DEBUG": "*",
      "DEBUG": "app:*",
      "NODE_ENV": "development"
    },
    
    env_production: {
      "NODE_ENV": "production"
    }
  }
};
