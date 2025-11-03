// GameEngine - manages game loop, state, and updates
import { Player } from "game/player"
import { ObstacleManager } from "game/obstacle_manager"
import { CollisionDetector } from "game/collision"
import { ScoreManager } from "game/score_manager"

export class GameEngine {
  constructor(canvas, ctx, groundLevel) {
    this.canvas = canvas
    this.ctx = ctx
    this.groundLevel = groundLevel
    this.gravity = 0.8
    this.gameOver = false

    // Initialize game objects
    const initialX = 50
    const initialY = groundLevel - 60
    this.player = new Player(initialX, initialY, groundLevel)
    this.obstacleManager = new ObstacleManager(groundLevel, canvas.width)
    this.scoreManager = new ScoreManager()
    this.gameStartTime = Date.now()
    
    // Input state
    this.keys = {
      left: false,
      right: false,
      jump: false
    }
  }

  update() {
    if (this.gameOver) {
      return
    }

    // Update player
    this.player.update(this.gravity, this.keys)
    
    // Keep player within canvas boundaries (can move left/right to dodge)
    if (this.player.x < 0) {
      this.player.x = 0
    }
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width - this.player.width
    }

    // Update obstacles (move them and spawn new ones)
    this.obstacleManager.update()

    // Update score based on survival time
    const elapsedTime = Date.now() - this.gameStartTime
    this.scoreManager.updateScore(elapsedTime)

    // Check collisions
    if (CollisionDetector.checkPlayerObstacleCollision(
      this.player,
      this.obstacleManager.getObstacles()
    )) {
      this.gameOver = true
      this.scoreManager.saveHighScore()
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw score
    this.scoreManager.draw(this.ctx)

    // Draw ground
    this.ctx.fillStyle = "#8B4513"
    this.ctx.fillRect(
      0,
      this.groundLevel,
      this.canvas.width,
      this.canvas.height - this.groundLevel
    )

    // Draw obstacles
    if (this.obstacleManager) {
      this.obstacleManager.draw(this.ctx)
    }

    // Draw player
    if (this.player) {
      this.player.draw(this.ctx)
    }

    // Draw game over screen
    if (this.gameOver) {
      this.drawGameOver()
    }
  }

  drawGameOver() {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Game over text
    this.ctx.fillStyle = "#FFFFFF"
    this.ctx.font = "48px Arial"
    this.ctx.textAlign = "center"
    this.ctx.fillText("Game Over!", this.canvas.width / 2, this.canvas.height / 2 - 20)

    this.ctx.font = "20px Arial"
    this.ctx.fillText(
      "Click Restart button to play again",
      this.canvas.width / 2,
      this.canvas.height / 2 + 20
    )
  }

  handleKeyDown(key) {
    if (key === "ArrowLeft") {
      this.keys.left = true
    } else if (key === "ArrowRight") {
      this.keys.right = true
    } else if (key === " " || key === "Spacebar") {
      if (this.player.isOnGround) {
        this.player.jump()
      }
    }
  }

  handleKeyUp(key) {
    if (key === "ArrowLeft") {
      this.keys.left = false
    } else if (key === "ArrowRight") {
      this.keys.right = false
    }
  }

  reset() {
    this.player.reset()
    this.gameOver = false
    this.scoreManager.reset()
    this.obstacleManager.reset()
    this.gameStartTime = Date.now()
    this.keys.left = false
    this.keys.right = false
    this.keys.jump = false
  }

  startGameLoop() {
    const gameLoop = () => {
      this.update()
      this.draw()
      requestAnimationFrame(gameLoop)
    }
    gameLoop()
  }
}

