let player = {};
let targets = [
  {
    x: 20,
    y: 10,
    direction: 0,
    velocity: 0,
    movementCountdown: 0
  },

  {
    x: 20,
    y: 15,
    direction: 0,
    velocity: 0,
    movementCountdown: 0
  },
  {
    x: 15,
    y: 20,
    direction: 0,
    velocity: 0,
    movementCountdown: 0
  }
];
let speed = 4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function collision(one, x, y) {
  return (one.x == x && one.y == y);
}

function transferMovement(from, to) {
  // Let's keep the first pass simple ...
  // Transfer all velocity, and stop player
  to.direction = from.direction;
  to.velocity = from.velocity;
  to.movementCountdown = 0;
  
  from.direction = 0;
  from.velocity = 0;
  from.movementCountdown = 0;
}

function create(game) {
  player = {
    x: 5,
    y: 10,
    direction: 0,
    velocity: 0,
    movementCountdown: 0,
  };
  game.setDot(player.x, player.y, Color.Black);
}

function update(game) {

  if (player.direction != 0 && player.movementCountdown == 0) {
    let x = player.x;
    let y = player.y;

    // Movement
    if (player.direction == Direction.Up) {
      y--;
    }
    if (player.direction == Direction.Down) {
      y++;
    }
    if (player.direction == Direction.Left) {
      x--;
    }
    if (player.direction == Direction.Right) {
      x++;
    }

    // Test for collisions
    for (let i in targets) {
      let target = targets[i];

      if (collision(target, x, y)) {
        transferMovement(player, target);

      }
      console.log(target);
      console.log(player);
    }

    player.x = clamp(x, 0, 23);
    player.y = clamp(y, 0, 23);

    player.movementCountdown = speed;
  } else {
    if (player.direction != 0) {
      player.movementCountdown--;
    }
  }


  
  
  // clamp to grid boundaries

  for (let i in targets) {
    let target = targets[i];

    if (target.direction != 0 && target.movementCountdown == 0) {
      let x = target.x;
      let y = target.y;
  
      // Movement
      if (target.direction == Direction.Up) {
        y--;
      }
      if (target.direction == Direction.Down) {
        y++;
      }
      if (target.direction == Direction.Left) {
        x--;
      }
      if (target.direction == Direction.Right) {
        x++;
      }
  
      // TODO: targets can move off-screen, don't clamp
      target.x = clamp(x, 0, 23);
      target.y = clamp(y, 0, 23);
  
      target.movementCountdown = speed;
    } else {
      if (target.direction != 0) {
        target.movementCountdown--;
      }
    }
    game.setDot(target.x, target.y, Color.Red);
  }

  game.setDot(player.x, player.y, Color.Black);
}

function onKeyPress(direction) {
  let key = player.x + ',' + player.y;

  player.direction = direction;
  player.movementCountdown = 0;
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  frameRate: 24
};

let game = new Game(config);
game.run();