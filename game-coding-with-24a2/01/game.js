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
  }
  game.setDot(player.x, player.y, Color.Black);
}

function onKeyPress(direction) {
  var key = player.x + ',' + player.y;
  seen[key] = [player.x, player.y];
  
  if (direction == Direction.Up) {
    player.y--;
  }
  if (direction == Direction.Down) {
    player.y++;
  }
  if (direction == Direction.Left) {
    player.x--;
  }
  if (direction == Direction.Right) {
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