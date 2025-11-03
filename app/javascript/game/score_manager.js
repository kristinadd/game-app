// ScoreManager - handles score tracking and high score persistence
export class ScoreManager {
  constructor() {
    this.score = 0
    this.highScore = 0
    this.loadHighScore()
  }

  loadHighScore() {
    const savedHighScore = localStorage.getItem("leapQuestHighScore")
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10)
    }
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem("leapQuestHighScore", this.highScore.toString())
    }
  }

  updateScore(playerX, initialX) {
    if (playerX > initialX) {
      this.score = Math.floor((playerX - initialX) / 10)
    }
  }

  reset() {
    this.saveHighScore()
    this.score = 0
  }

  draw(ctx) {
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${this.score}`, 10, 30)
    ctx.fillText(`High Score: ${this.highScore}`, 10, 55)
  }
}

