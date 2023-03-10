export let levels = [
  {
    text: "<p>As a student at grit:lab, you were used to the occasional \
     technical glitch or two, but when the servers went down, you knew this was a big problem. \
     You find out that there is a new hacking tool called 'brick-breaker.js'\
     that allows you to hack into the grit:lab mainframe and fix the bugs. <br>\
     So you decide to dig deeper... <br><br> \
     Press space to continue...</p>",
    totalBricks: 20,
    bricks: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
      ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B"]
    ]
  },
  {
    text: "<p>Things are getting harder...<br><br>\
    Press space to continue...</p>",
    bricks: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", "B", "B", "B", " ", " ", " ", " "],
      ["B", "B", "B", "B", "P", "B", "B", "B", "B", "B"],
      ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B"]
    ]
  },
  // add more levels as needed
];

const brickArea = document.querySelector(".brick-area");

export let bricksArray = [];

export function drawBricks(levelIndex) {
  console.log(levelIndex)
    const level = levels[levelIndex]
    const bricks = level.bricks;
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            let brick = document.createElement("div");
            switch(bricks[i][j]){
              case "B":
                brick.classList.add("brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricksArray.push(brick);
                break;
              case "P":
                brick.classList.add("powerup-brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricksArray.push(brick);
                break;
              case "S":
                brick.classList.add("steel-brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricksArray.push(brick);
                break;
            }
        }
    }
}


export function resetBricks() {
  for (let i = 0; i < bricksArray.length; i++) {
    brickArea.removeChild(bricksArray[i]);
  }
  bricksArray = [];
}