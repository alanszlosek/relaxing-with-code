let player = {};

let targets = [
  {
    color: Color.Red,
    x: 20,
    y: 10,
    direction: 0,
    velocity: 0,
    movementCountdown: 0,
    done: false
  },
  {
    color: Color.Green,
    x: 20,
    y: 15,
    direction: 0,
    velocity: 0,
    movementCountdown: 0,
    done: false
  },
  {
    color: Color.Blue,
    x: 15,
    y: 20,
    direction: 0,
    velocity: 0,
    movementCountdown: 0,
    done: false
  }
];
let speed = 4;

let score = 0;


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
    color: Color.Black,
    x: 5,
    y: 10,
    direction: 0,
    velocity: 0,
    movementCountdown: 0,
    done: false
  };
  targets.unshift(player);
}

function update(game) {
  for (let i in targets) {
    let target = targets[i];
    let isPlayer = (i == 0);
    if (target.done) {
      continue;
    }

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

      // Test for collisions
      for (let j in targets) {
        let other = targets[j];
        if (i == j) {
          continue;
        }
        if (other.done) {
          continue;
        }

        if (collision(other, x, y)) {
          transferMovement(target, other);

        }
        console.log(target);
        console.log(player);
      }
  
      // TODO: targets can move off-screen, don't clamp
      if (isPlayer) {
        target.x = clamp(x, 0, 23);
        target.y = clamp(y, 0, 23);
      } else {

        if (x < 0 || x > 23 || y < 0 || y > 23) {
          score++;
          document.getElementById('score').innerText = 'Score: ' + score;
          target.done = true;

          if (score == targets.length - 1) {
            game.end();
          }

        } else {

          target.x = x;
          target.y = y;
        }
      }
  
      target.movementCountdown = speed;
    } else {
      if (target.direction != 0) {
        target.movementCountdown--;
      }
    }

    game.setDot(target.x, target.y, target.color);
  }
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