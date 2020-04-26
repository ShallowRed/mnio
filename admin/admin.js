var socket = io();

const ADMIN = {

  init: function() {
    this.Games = [];

    this.current = document.getElementById('current');
    this.gameswindow = document.getElementById("gameswindow");
    this.canvaswindow = document.getElementById("canvaswindow");
    this.gamelist = document.getElementById("games");
    this.close = document.getElementById('close');
    this.setflag = document.getElementById('setflag');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.slider = document.getElementById("slider");

    this.slider.value = 0;

    this.slider.oninput = function() {
      if (!ADMIN.lastvalue) ADMIN.lastvalue = ADMIN.slider.value;
      ADMIN.render(ADMIN.lastvalue, this.value);
      ADMIN.lastvalue = this.value;
    };

    window.addEventListener('resize', function() {
      ADMIN.render();
    }, true);

    socket.emit("getgames");

    this.close.addEventListener("click", function() {
      ADMIN.toggle();
    });

    this.setflag.addEventListener("click", function() {
      console.log("setflag");
      socket.emit("setflag", 1);
    });

    this.current.addEventListener("click", function() {
      socket.emit("getcurrent");
    });

  },

  getgames: function(data) {

    data.forEach(function(game) {
      ADMIN.Games.push(game);
      let li = document.createElement('li');
      ADMIN.gamelist.appendChild(li);
      li.innerHTML += "game n°" + game[0] + ", rows: " + game[1] + ", cols: " + game[2];
      li.id = "game_" + game[0];
      li.className = "game";
      if (!game[3]) li.style.background = 'lightpink';
      else li.style.background = 'lightgreen';
    });

    this.dom = document.querySelectorAll(".game");
    this.dom.forEach(function(game) {
      game.addEventListener('click', function(event) {
        socket.emit('gettable', game.id.split("_")[1]);
        ADMIN.selectedtable = game.id.split("_")[1];
      });
    });
  },

  setup: function(data) {

    if (!this.currentflag) {
      let len = this.Games.length;
      for (i = 0; i < len; i++)
        if (this.Games[i][0] = this.selectedtable) {
          this.rows = this.Games[i][1];
          this.cols = this.Games[i][2];
          this.ColorList = data;
        };
      ADMIN.slider.max = data.length;
    } else {
      this.rows = data.rows;
      this.cols = data.cols;
      this.ColorList = data.ColorList;
    };

    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w > h) h = w = Math.round(h * 0.85);
    else w = h = Math.round(w * 0.85);

    this.canvas.width = w;
    this.canvas.height = h;
    this.CellSize = Math.round(w / this.rows);
    h = w = this.CellSize * this.rows;
    this.canvas.style.margin = (window.innerHeight - h) / 2 + "px " + (window.innerWidth - w) / 2 + "px";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  toggle: function(current) {
    if (current) {
      this.currentflag = true;
      this.slider.hidden = true;
    } else {
      this.currentflag = false;
      this.slider.hidden = false;
    }
    if (this.canvaswindow.hidden) {
      this.canvaswindow.hidden = false;
      this.gameswindow.hidden = true;
    } else {
      this.canvaswindow.hidden = true
      this.gameswindow.hidden = false;
    }
  },

  render: function(start, end) {
    if (this.currentflag) {
      let len = this.ColorList.length;
      for (i = 0; i < len; i++)
        if (this.ColorList[i] !== null) CELL.fill(i, this.ColorList[i]);
      return;
    }
    let len = this.ColorList.length;
    for (let i = 0; i < len; i++) {
      CELL.fill(this.ColorList[i][0], this.ColorList[i][1]);
      // console.log("filling cell with index : " + i);
    }

    // if (end > start) {
    //   console.log("end > start");
    //   console.log("start is : " + start);
    //   console.log("end is : " + end);
    //   for (let i = start; i < end; i++) {
    //     CELL.fill(this.ColorList[i][0], this.ColorList[i][1]);
    //     console.log("filling cell with index : " + i);
    //   }
    // } else if (end < start) {
    //   console.log("end < start");
    //   console.log("start is : " + start);
    //   console.log("end is : " + end);
    //   for (let i = start; i > end; i--) {
    //     CELL.clear(this.ColorList[i - 1][0]);
    //     let j = i - 1;
    //     console.log("clearing cell with index : " + j);
    //   }
    // }
  }

}

const CELL = {

  fill: function(position, color) {
    let coordx = (position - (position % ADMIN.rows)) / ADMIN.cols;
    let coordy = (position % ADMIN.cols);
    ADMIN.ctx.clearRect(ADMIN.CellSize * coordy, ADMIN.CellSize * coordx, ADMIN.CellSize, ADMIN.CellSize);
    ADMIN.ctx.fillStyle = color;
    ADMIN.ctx.fillRect(ADMIN.CellSize * coordy, ADMIN.CellSize * coordx, ADMIN.CellSize, ADMIN.CellSize)
  },

  clear: function(position) {
    let coordx = (position - (position % ADMIN.rows)) / ADMIN.cols;
    let coordy = (position % ADMIN.cols);
    ADMIN.ctx.clearRect(ADMIN.CellSize * coordy, ADMIN.CellSize * coordx, ADMIN.CellSize, ADMIN.CellSize);
  }

}

socket.on('games', function(data) {
  ADMIN.getgames(data)
});

socket.on('table', function(data) {
  ADMIN.toggle();
  ADMIN.setup(data);
  ADMIN.render();
});

socket.on('current', function(data) {
  ADMIN.toggle("current");
  ADMIN.setup(data);
  ADMIN.render();
});

socket.on('NewCell', function(cell) {
  if (!ADMIN.currentflag) return;
  ADMIN.ColorList[cell.position] = cell.color;
  CELL.fill(cell.position, cell.color);
});

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});

ADMIN.init();
