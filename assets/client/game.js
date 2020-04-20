const GAME = {
  duration: 0.2,

  init: function(data, PLAYER, UI, MAP, socket) {
    this.colors = data.ColorList;
    this.positions = data.PositionList;
    this.allowed = data.allowedlist;
    this.rows = data.uiparams[0];
    this.cols = data.uiparams[1];
    this.flag = true;

    PLAYER.init(data);
    MAP.init();
    this.render(MAP, PLAYER);
    UI.init(GAME, PLAYER, MAP, socket);
  },

  update: function(animated, MAP, PLAYER) {
    PLAYER.update(animated, GAME, MAP);
    MAP.update(animated, PLAYER, GAME);
  },

  render: function(MAP, PLAYER) {
    MAP.setup();
    this.update(null, MAP, PLAYER);
    MAP.render(PLAYER, GAME);
  },

};

module.exports = GAME
