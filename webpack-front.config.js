const path = require('path');

module.exports = {
  target: "web",
  entry: {
    app: ["./assets/app.js"]
  },
  mode: 'production',
  // mode: 'none',
  // mode: 'development',
  watch: true,
  output: {
    path: path.resolve('./public'),
    filename: 'bundle-front.js'
  }
}
