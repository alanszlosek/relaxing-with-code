let player = {};
var seen = {};

function create(game) {
  player = {
    x: 5,
    y: 10,
  };
  game.setDot(player.x, player.y, Color.Black);
}

function update(game) {
  for (var key in seen) {
    var coords = seen[key];
    game.setDot(coords[0], coords[1], Color.Yellow);


    var horizontal = coords[2];
    var frame = coords[3];
    if (frame < 9) {
      if (frame > 0) {
        if (horizontal) {
          // horizontal motion
          game.setDot(coords[0], coords[1] + frame, Color.Orange);
          game.setDot(coords[0], coords[1] - frame, Color.Orange);
        } else {
          game.setDot(coords[0] + frame, coords[1], Color.Orange);
          game.setDot(coords[0] - frame, coords[1], Color.Orange);
        }
      }
      coords[3]++;
    }

  }
  game.setDot(player.x, player.y, Color.Black);
}

function onKeyPress(direction) {
  var key = player.x + ',' + player.y;

  var horizontal = (direction == Direction.Left || direction == Direction.Right);

  seen[key] = [player.x, player.y, horizontal, 0];

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
};

let game = new Game(config);
game.run();