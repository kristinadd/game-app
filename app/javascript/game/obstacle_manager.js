// ObstacleManager - manages obstacles in the game
export class ObstacleManager {
  constructor(groundLevel) {
    this.groundLevel = groundLevel
    this.obstacles = this.createInitialObstacles()
  }

  createInitialObstacles() {
    return [
      {
        x: 300,
        y: this.groundLevel - 40,
        width: 30,
        height: 40,
        color: "#FF6B6B"
      },
      {
        x: 500,
        y: this.groundLevel - 40,
        width: 30,
        height: 40,
        color: "#FF6B6B"
      },
      {
        x: 700,
        y: this.groundLevel - 40,
        width: 30,
        height: 40,
        color: "#FF6B6B"
      }
    ]
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
}

