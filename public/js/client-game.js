const GAME = {
  duration: 0.2,

  init: function(data) {
    this.colors = data.ColorList;
    this.positions = data.PositionList;
    this.allowed = data.allowedlist;
    this.rows = data.uiparams[0];
    this.cols = data.uiparams[1];
    this.flag = true;

    PLAYER.init(data);
    MAP.init();
    this.render();
    UI.init();
  },

  update: function(animated) {
    PLAYER.update(animated);
    MAP.update(animated);
  },

  render: function() {
    MAP.setup();
    GAME.update();
    MAP.render();
  },

};
