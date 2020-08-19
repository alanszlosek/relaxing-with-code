let player = {};
let seen = {};

function create(game) {
  player = {
    x: 5,
    y: 10,
  };
  game.setDot(player.x, player.y, Color.Black);
}

function update(game) {
  for (let key in seen) {
    let coords = seen[key];
    game.setDot(coords.x, coords.y, Color.Yellow);

    if (coords.frame < 7) {
      if (coords.frame > 0) {
        // TODO: wrap setDot with out-of-bounds protections
        if (coords.horizontal) {
          // horizontal motion
          game.setDot(coords.x, coords.y + coords.frame, Color.Orange);
          game.setDot(coords.x, coords.y - coords.frame, Color.Orange);
        } else {
          game.setDot(coords.x + coords.frame, coords.y, Color.Orange);
          game.setDot(coords.x - coords.frame, coords.y, Color.Orange);
        }
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
    frame: 0
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