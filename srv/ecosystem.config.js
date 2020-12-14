module.exports = {
  apps: {
    script: 'lib/index.js',
    watch: true,
    ignore_watch: [
      "node_modules",
      "dist",
      "datadev",
      ".gitignore",
      ".gitattributes",
      ".git"
    ],
    watch_options: {
      followSymlinks: false
    }
  }
};
