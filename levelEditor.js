let levels = {
  "1": [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ["S", "B", "B", "B", "P", "B", "B", "B", "B", "S"]
  ],
  "2": [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B"]
  ],

}

const brickArea = document.querySelector(".brick-area");

export let bricks = [];

export function drawBricks(level) {
    level = level + "";
    for (let i = 0; i < levels[level].length; i++) {
        for (let j = 0; j < levels[level][i].length; j++) {
            let brick = document.createElement("div");
            switch(levels[level][i][j]){
              case "B":
                brick.classList.add("brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricks.push(brick);
                break;
              case "P":
                brick.classList.add("powerup-brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricks.push(brick);
                break;
              case "S":
                brick.classList.add("steel-brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricks.push(brick);
                break;
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