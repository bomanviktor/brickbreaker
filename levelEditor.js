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
    totalBricks: 23,
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
  {
    text: "<p>Level 3 story here.<br><br>\
    Press space to continue...</p>",
    totalBricks: 23,
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

let brickMap = {
  B: "brick",
  P: "powerup-brick",
  S: "steel-brick"
};

export function drawBricks(levelIndex) {
  const level = levels[levelIndex];
  const bricks = level.bricks;
  for (let i = 0; i < bricks.length; i++) {
    for (let j = 0; j < bricks[i].length; j++) {
      if (!brickMap.hasOwnProperty(bricks[i][j])) continue;
      let brick = document.createElement("div");
      brick.classList.add(brickMap[bricks[i][j]]);
      brick.style.gridColumn = j + 1;
      brick.style.gridRow = i + 1;
      brickArea.appendChild(brick);
      bricksArray.push(brick);
    }
  }
}

export function resetBricks() {
  for (let i = 0; i < bricksArray.length; i++) {
    brickArea.removeChild(bricksArray[i]);
  }
  bricksArray = [];
}