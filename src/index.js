import { Sprite, Fighter } from './js/classes.js';
import { keys } from './js/keys.js';
import { keydown, keyup } from './js/eventListeners.js';
import {
  rectangularCollision,
  determineWinner,
  timer,
} from './js/helperFunctions.js';
import {
  backgroundImg,
  idleHero,
  runHero,
  jumpHero,
  fallHero,
  attackHero1,
  takeHitHero,
  deathHero,
  idleEnemy,
  runEnemy,
  jumpEnemy,
  fallEnemy,
  attackEnemy1,
  takeHitEnemy,
  deathEnemy,
} from './assets';
import './styles/styles.scss';

let gameStarted = false;
window.addEventListener('keydown', (event) => {
  if (!gameStarted && event.key === 'Enter') startGame();
});

function startGame() {
  gameStarted = true;
  document.querySelector('#instructions').style.display = 'none';

  // Render UI
  const ui = document.querySelector('.game-container');
  ui.style.display = 'flex';

  // Add the event listeners
  window.addEventListener('keydown', (event) =>
    keydown(event, { player, enemy })
  );
  window.addEventListener('keyup', (event) => keyup(event));

  // Draw the canvas
  const canvas = document.querySelector('canvas');
  const c = canvas.getContext('2d');
  canvas.width = 1366;
  canvas.height = 738;
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 30,
    },
    imageSrc: backgroundImg,
  });

  // Create the players
  const player = new Fighter({
    position: {
      x: 200,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    color: 'red',
    imageSrc: idleHero,
    healthbar: document.querySelector('#playerHealth'),
    framesMax: 8,
    scale: 2.5,
    offset: {
      x: 215,
      y: 157,
    },
    sprites: {
      idle: {
        imageSrc: idleHero,
        framesMax: 8,
      },
      run: {
        imageSrc: runHero,
        framesMax: 8,
      },
      jump: {
        imageSrc: jumpHero,
        framesMax: 2,
      },
      fall: {
        imageSrc: fallHero,
        framesMax: 2,
      },
      attack1: {
        imageSrc: attackHero1,
        framesMax: 4,
      },
      takeHit: {
        imageSrc: takeHitHero,
        framesMax: 4,
      },
      death: {
        imageSrc: deathHero,
        framesMax: 6,
      },
    },
    attackBox: {
      offset: {
        x: 3,
        y: 25,
      },
      width: 160,
      height: 50,
    },
  });

  const enemy = new Fighter({
    position: {
      x: 1100,
      y: 100,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    color: 'blue',
    offset: {
      x: 215,
      y: 195,
    },
    imageSrc: idleEnemy,
    healthbar: document.querySelector('#enemyHealth'),
    framesMax: 10,
    scale: 3,
    sprites: {
      idle: {
        imageSrc: idleEnemy,
        framesMax: 10,
      },
      run: {
        imageSrc: runEnemy,
        framesMax: 8,
      },
      jump: {
        imageSrc: jumpEnemy,
        framesMax: 3,
      },
      fall: {
        imageSrc: fallEnemy,
        framesMax: 3,
      },
      attack1: {
        imageSrc: attackEnemy1,
        framesMax: 7,
      },
      takeHit: {
        imageSrc: takeHitEnemy,
        framesMax: 3,
      },
      death: {
        imageSrc: deathEnemy,
        framesMax: 7,
      },
    },
    attackBox: {
      offset: {
        x: -125,
        y: 25,
      },
      width: 170,
      height: 50,
    },
  });

  player.draw(c);
  enemy.draw(c);

  // Start timer for 60 seconds
  var decreaseTimer = timer(60, { player, enemy });
  decreaseTimer();

  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update(c);
    c.fillStyle = 'rgba(255, 255,255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update(canvas);
    enemy.update(canvas);

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player Movement

    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5;
      player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 5;
      player.switchSprite('run');
    } else player.switchSprite('idle');

    if (player.velocity.y < 0) {
      player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall');
    }

    // Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5;
      enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = 5;
      enemy.switchSprite('run');
    } else enemy.switchSprite('idle');

    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall');
    }

    // Detect for Collisions
    if (
      rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
      player.isAttacking &&
      player.framesCurrent === 3
    ) {
      enemy.takeHit();
      player.isAttacking = false;
      document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 3) {
      player.isAttacking = false;
    }

    if (
      rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 5
    ) {
      player.takeHit();
      enemy.isAttacking = false;
      document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 5) {
      enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy });
      gameStarted = false;
    }
  }

  // Start the game
  animate();
}
