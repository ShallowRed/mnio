module.exports = {
  apps: {
    script: 'lib/index.js',
    env: {
      DEBUG: "mnio"
    },
    // node_args: "--inspect=3500",
    watch: true,
    ignore_watch: [
      "node_modules",
      "app",
      "dist",
      "data",
      "datadev",
      ".gitignore",
      ".gitattributes",
      ".git",
      "README.md",
      "TODO.md",
      "webpack.*.js"
    ],
    watch_options: {
      followSymlinks: false
    }
  }

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
