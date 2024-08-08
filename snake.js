// Get the canvas element and its context
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// Define the size of the grid squares
var grid = 16;

// Counter for game speed control
var count = 0;

// Define the snake object
var snake = {
  x: 160, // Initial horizontal position
  y: 160, // Initial vertical position
  dx: grid, // Horizontal speed
  dy: 0, // Vertical speed
  cells: [], // Array to hold the cells the snake occupies
  maxCells: 4, // Initial length of the snake
};

// Define the obstacles
var obstacles = [
  { x: 5 * grid, y: 3 * grid },
  { x: 8 * grid, y: 7 * grid },
  // Add more obstacles as needed
];

// Define the apple object
var apple = {
  x: getRandomInt(0, 25) * grid, // Initial horizontal position
  y: getRandomInt(0, 25) * grid, // Initial vertical position
};

// Function to get a random integer within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Main game loop
function loop() {
  // Use requestAnimationFrame for smooth animation
  requestAnimationFrame(loop);

  obstacles.forEach(function (obstacle) {
    context.fillStyle = 'red'; // Color of the obstacles
    context.fillRect(obstacle.x, obstacle.y, grid - 1, grid - 1);
  });

  // Control the game speed by skipping frames
  if (++count < 10) {
    return;
  }

  // Reset the counter
  count = 0;

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Move the snake by changing its position
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap the snake's position when it reaches the edge of the canvas
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Add the new position to the beginning of the cells array
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Remove the last cell if the snake is at maximum length
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw the apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw the snake
  context.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Check if the snake has eaten the apple
    if (cell.x === apple.x && cell.y === apple.y) {
      // Increase the length of the snake
      snake.maxCells++;

      // Move the apple to a new random position
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check for collision with the snake's own body
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        // Reset the game
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
    // In your collision detection logic, check if the snake has hit an obstacle
    snake.cells.forEach(function (cell, index) {
      // Check if the snake has hit an obstacle
      obstacles.forEach(function (obstacle) {
        if (cell.x === obstacle.x && cell.y === obstacle.y) {
          // Game over
          snake.cells = [];
        }
      });
    });
  });
}

// Listen for keydown events to control the snake
document.addEventListener('keydown', function (e) {
  // Prevent the snake from reversing direction
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start the game loop
requestAnimationFrame(loop);
