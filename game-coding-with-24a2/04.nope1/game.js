let player = {};
let seen = {};

let rippleColors = [Color.Indigo, Color.Blue, Color.Indigo, Color.Violet];

function create(game) {
  player = {
    x: 5,
    y: 10,
  };
  game.setDot(player.x, player.y, Color.Black);
}

function safeSetDot(x, y, color) {
  if (x < 0 || x > 23 || y < 0 || y > 23) {
    return;
  }
  game.setDot(x, y, color);
}

function update(game) {
  for (let key in seen) {
    let coords = seen[key];
    game.setDot(coords.x, coords.y, Color.Yellow);

    // think of this conditional as a test of whether the ripple has reached "maximum reach"
    if (coords.frame < 6 + 4) {

      let reach = coords.reach;
      if (reach > 0) {
        for (let i = coords.index; i < 4; i++) {
          let x1 = (coords.horizontal ? coords.x : coords.x + reach + i);
          let x2 = (coords.horizontal ? coords.x : coords.x - reach - i);
          let y1 = (coords.horizontal ? coords.y + reach + i: coords.y);
          let y2 = (coords.horizontal ? coords.y - reach - i : coords.y);

          safeSetDot(x1, y1, rippleColors[i]);
          safeSetDot(x2, y2, rippleColors[i]);
        }
        coords.index += (game.getFrameCount() % 4 == 0 ? 1 : 0);

        /*
        for (let i = coords.index; i < rippleColors.length; i++) {
          let x1 = (coords.horizontal ? coords.x : coords.x + reach);
          let x2 = (coords.horizontal ? coords.x : coords.x - reach);
          let y1 = (coords.horizontal ? coords.y + reach: coords.y);
          let y2 = (coords.horizontal ? coords.y - reach : coords.y);

          safeSetDot(x, y, rippleColors[i]);
        }
        */
      }

      if (coords.reach < 6) {
        coords.reach += (game.getFrameCount() % 4 == 0 ? 1 : 0);
      }
      
      coords.frame += (game.getFrameCount() % 4 == 0 ? 1 : 0);
    }
  }
  game.setDot(player.x, player.y, Color.Black);
}

function onKeyPress(direction) {
  let key = player.x + ',' + player.y;

  seen[key] = {
    x: player.x,
    y: player.y,
    horizontal: (direction == Direction.Left || direction == Direction.Right),
    frame: 0,
    reach: 0,
    // where in the ripple color list we should begin when we draw
    index: 0
  };

  if (direction == Direction.Up && player.y > 0) {
    player.y--;
  }
  if (direction == Direction.Down && player.y < 23) {
    player.y++;
  }
  if (direction == Direction.Left && player.x > 0) {
    player.x--;
  }
  if (direction == Direction.Right && player.x < 23) {
    player.x++;
  }


}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  frameRate: 24
};

let game = new Game(config);
game.run();