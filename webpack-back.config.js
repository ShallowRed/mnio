const path = require('path');

module.exports = {
  target: "node",
  entry: {
    app: ["./server.js"]
  },
  mode: 'production',
  // mode: 'none',
  // mode: 'development',
  watch: false,
  output: {
    path: __dirname,
    filename: 'bundle-back.js'
  },
}
