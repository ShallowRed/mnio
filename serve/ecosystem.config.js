module.exports = {
  apps: {
    script: './serve/app.js',
    watch: true,
    ignore_watch: [
      "src",
      "node_modules",
      "serve/node_modules",
      "serve/dist",
      "serve/datadev",
      ".gitignore",
      ".gitattributes",
      ".git"
    ],
    watch_options: {
      followSymlinks: false
    }
  }
};
