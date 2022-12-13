export function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

export function determineWinner({ player, enemy, timerId = null }) {
  clearTimeout(timerId);
  if (player.health === enemy.health)
    document.querySelector('#displayText').innerHTML = 'Draw!';
  else if (player.health > enemy.health)
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins!';
  else document.querySelector('#displayText').innerHTML = 'Player 2 Wins!';
  document.querySelector('#displayText').style.display = 'flex';
}

export function timer(time, { player, enemy }) {
  let timerId;
  function decreaseTimer() {
    if (time > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      time--;
      document.querySelector('#timer').innerHTML = time;
    }

    if (time === 0) determineWinner({ player, enemy, timerId });
  }
  return decreaseTimer;
}
