let player = {};
let targets = [
  {
    x: 20,
    y: 10,
    velocityMultiplierX: 0,
    velocityMultiplierY: 0,
    velocityX: 0,
    velocityY: 0,
    collision: false
  },
  {
    x: 20,
    y: 15,
    velocityMultiplierX: 0,
    velocityMultiplierY: 0,
    velocityX: 0,
    velocityY: 0,
    collision: false
  }
];

let velocityStep = 0.12;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function collision(one, two) {
  return (Math.trunc(one.x) == Math.trunc(two.x) && Math.trunc(one.y) == Math.trunc(two.y));
}

function collision2(one, x, y) {
  return (one.x == x && one.y == y);
}

function outOfBounds(object) {
  return (object.x < 0 || object.x > 23 || object.y < 0 || object.y > 23);
}


function transferVelocity(from, to) {
  // Let's keep the first pass simple ...
  // Transfer all velocity, and stop player
  to.velocityMultiplierX = from.velocityMultiplierX;
  to.velocityMultiplierY = from.velocityMultiplierY;
  // Update target's velocity
  to.velocityX = to.velocityMultiplierX * velocityStep;
  to.velocityY = to.velocityMultiplierY * velocityStep;

  from.velocityMultiplierX = 0;
  from.velocityMultiplierY = 0;
  from.velocityX = 0;
  from.velocityY = 0;
}

function create(game) {
  player = {
    x: 5,
    y: 10,
    // Arrow keys adjust these multpliers up or down based on speedStep value
    // Set other direction's mult to 0. Clamp to -2 and 2 (two speeds for now)
    velocityMultiplierX: 0,
    velocityMultiplierY: 0,
    // These will be calculated after multipliers are set upon keypress
    velocityX: 0,
    velocityY: 0
  };
}

function update(game) {
  // update player x andy
  player.x = player.x + player.velocityX;
  player.y = player.y + player.velocityY;

  let x = clamp(Math.trunc(player.x), 0, 23);
  let y = clamp(Math.trunc(player.y), 0, 23);


  game.setDot(x, y, Color.Black);


  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];

    if (collision(player, target)) {
      if (!target.collision) {
        transferVelocity(player, target);
        target.collision = true;
      }
    }

    target.x = target.x + target.velocityX;
    target.y = target.y + target.velocityY;
  
    let x = clamp(Math.trunc(target.x), 0, 23);
    let y = clamp(Math.trunc(target.y), 0, 23);
    //console.log(target);

    game.setDot(x, y, Color.Red);
  }
}

function onKeyPress(direction) {
  if (direction == Direction.Up) {
    player.velocityMultiplierY--;
    player.velocityMultiplierX = 0;
  }
  if (direction == Direction.Down) {
    player.velocityMultiplierY++;
    player.velocityMultiplierX = 0;
  }
  if (direction == Direction.Left) {
    player.velocityMultiplierX--;
    player.velocityMultiplierY = 0;
  }
  if (direction == Direction.Right) {
    player.velocityMultiplierX++;
    player.velocityMultiplierY = 0;
  }

  clamp(player.velocityMultiplierX, -2, 2);
  clamp(player.velocityMultiplierY, -2, 2);

  player.velocityX = player.velocityMultiplierX * velocityStep;
  player.velocityY = player.velocityMultiplierY * velocityStep;
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  frameRate: 24
};

let game = new Game(config);
game.run();