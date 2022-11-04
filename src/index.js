import { Sprite, Fighter } from './js/classes.js';
import { keys } from './js/keys.js';
import { keydown, keyup } from './js/eventListeners.js';
import {
  rectangularCollision,
  determineWinner,
  timer,
} from './js/helperFunctions.js';
import './styles/styles.scss';

// Add the event listeners
window.addEventListener('keydown', (event) =>
  keydown(event, { player, enemy })
);
window.addEventListener('keyup', (event) => keyup(event));

// Draw the canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

// Create the players
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
});

player.draw(c);
enemy.draw(c);

// Start timer for 60 seconds
let decreaseTimer = timer(60, { player, enemy });
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update(canvas);
  enemy.update(canvas);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player Movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
  }

  // Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
  }

  // Detect for Collisions
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy });
  }
}

// Start the game
animate();
