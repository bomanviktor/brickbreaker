const levels = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

const brickArea = document.querySelector(".brick-area");

export let bricks = [];

export function drawBricks() {
    for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            if (levels[i][j] === 1) {
                let brick = document.createElement("div");
                brick.classList.add("brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricks.push(brick);
            }
        }
    }
}


export function resetBricks() {
  for (let i = 0; i < bricks.length; i++) {
    brickArea.removeChild(bricks[i]);
  }
  bricks = [];
}