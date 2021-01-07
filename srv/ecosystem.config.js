module.exports = {
  apps: {
    script: './srv/app.js',
    watch: true,
    ignore_watch: [
      "src",
      "node_modules",
      "srv/node_modules",
      "srv/dist",
      "srv/datadev",
      ".gitignore",
      ".gitattributes",
      ".git"
    ],
    watch_options: {
      followSymlinks: false
    }
  }
};
