module.exports = {

  queries: Object.assign(require('./logUser'), {
    saveFill: require('./saveFill')
  }),

  bindGameId(gameid, boundDb = {}) {
    Object.entries(this.queries)
      .forEach(([key, fn]) => {
        boundDb[key] = async (...args) =>
          await fn.call({ gameid }, ...args)
      });
    return boundDb;
  }
};
