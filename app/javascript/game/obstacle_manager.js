// ObstacleManager - manages obstacles in the game (endless runner mode)
export class ObstacleManager {
  constructor(groundLevel, canvasWidth) {
    this.groundLevel = groundLevel
    this.canvasWidth = canvasWidth
    this.obstacleSpeed = 2 // Speed at which obstacles move toward player
    this.spawnInterval = 90 // Spawn new obstacle approximately every 1.5 seconds (90 frames at 60fps)
    this.spawnTimer = 0
    this.obstacles = []
    this.obstacleSpacing = 250 // Minimum distance between obstacles
  }

  update() {
    // Move all obstacles left (toward the player)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].x -= this.obstacleSpeed
      
      // Remove obstacles that have gone off-screen
      if (this.obstacles[i].x + this.obstacles[i].width < 0) {
        this.obstacles.splice(i, 1)
      }
    }

    // Spawn new obstacles
    this.spawnTimer++
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle()
      this.spawnTimer = 0
      // Randomize spawn interval for variety (60-120 frames = 1-2 seconds)
      this.spawnInterval = 60 + Math.random() * 60
    }
  }

  spawnObstacle() {
    // Check if we can spawn based on the rightmost obstacle position
    const rightmostObstacle = this.getRightmostObstacle()
    
    // If no obstacles or rightmost obstacle is far enough to the left, spawn a new one
    if (!rightmostObstacle || rightmostObstacle.x < this.canvasWidth - this.obstacleSpacing) {
      const obstacle = {
        x: this.canvasWidth, // Start off-screen on the right
        y: this.groundLevel - 40,
        width: 30,
        height: 40,
        color: "#FF6B6B"
      }
      this.obstacles.push(obstacle)
    }
  }

  getRightmostObstacle() {
    // Find the obstacle that's furthest to the right
    if (this.obstacles.length === 0) return null
    
    let rightmost = this.obstacles[0]
    for (const obstacle of this.obstacles) {
      if (obstacle.x > rightmost.x) {
        rightmost = obstacle
      }
    }
    return rightmost
  }

  draw(ctx) {
    for (const obstacle of this.obstacles) {
      ctx.fillStyle = obstacle.color
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    }
  }

  getObstacles() {
    return this.obstacles
  }

  reset() {
    this.obstacles = []
    this.spawnTimer = 0
    this.spawnInterval = 90
  }
}

