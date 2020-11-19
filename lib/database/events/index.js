module.exports = {

  queries: Object.assign(require('./login'), {
    saveFill: require('./inGame')
  }),

  bindGameId(gameid, boundDb = {}) {
    Object.entries(this.queries)
      .forEach(([key, fn]) => {
        boundDb[key] = async (...args) =>
          await fn(...args, gameid)
      });
    return boundDb;
  }
};
