// ObstacleManager - manages obstacles in the game (endless runner mode)
export class ObstacleManager {
  constructor(groundLevel, canvasWidth) {
    this.groundLevel = groundLevel
    this.canvasWidth = canvasWidth
    this.obstacleSpeed = 1.5 // Speed at which obstacles move toward player
    this.spawnInterval = 120 // Spawn new obstacle approximately every 2 seconds (120 frames at 60fps)
    this.spawnTimer = 0
    this.obstacles = []
    this.obstacleSpacing = 300 // Minimum distance between obstacles
    this.verticalMovementSpeed = 1 // Speed for vertical movement
  }

  update() {
    // Move all obstacles left (toward the player) and handle vertical movement
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i]
      
      // Move obstacle left
      obstacle.x -= this.obstacleSpeed
      
      // Handle vertical movement if obstacle has vertical movement
      if (obstacle.verticalMovement) {
        obstacle.verticalOffset += obstacle.verticalDirection * this.verticalMovementSpeed
        obstacle.y = this.groundLevel - obstacle.height - 40 + obstacle.verticalOffset
        
        // Reverse direction if obstacle hits top or bottom boundary
        const maxVerticalOffset = 100 // Maximum vertical movement range
        if (obstacle.verticalOffset >= maxVerticalOffset || obstacle.verticalOffset <= -maxVerticalOffset) {
          obstacle.verticalDirection *= -1
        }
      }
      
      // Remove obstacles that have gone off-screen
      if (obstacle.x + obstacle.width < 0) {
        this.obstacles.splice(i, 1)
      }
    }

    // Spawn new obstacles
    this.spawnTimer++
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle()
      this.spawnTimer = 0
      // Randomize spawn interval for variety (90-150 frames = 1.5-2.5 seconds)
      this.spawnInterval = 90 + Math.random() * 60
    }
  }

  spawnObstacle() {
    // Check if we can spawn based on the rightmost obstacle position
    const rightmostObstacle = this.getRightmostObstacle()
    
    // If no obstacles or rightmost obstacle is far enough to the left, spawn a new one
    if (!rightmostObstacle || rightmostObstacle.x < this.canvasWidth - this.obstacleSpacing) {
      // Randomly decide if this obstacle should have vertical movement (30% chance)
      const hasVerticalMovement = Math.random() < 0.3
      
      const obstacle = {
        x: this.canvasWidth, // Start off-screen on the right
        y: this.groundLevel - 40,
        width: 30,
        height: 40,
        color: "#FF6B6B",
        verticalMovement: hasVerticalMovement,
        verticalOffset: 0, // Current vertical offset from base position
        verticalDirection: hasVerticalMovement ? (Math.random() < 0.5 ? 1 : -1) : 0 // 1 = moving up, -1 = moving down
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
    this.spawnInterval = 120
  }
}

