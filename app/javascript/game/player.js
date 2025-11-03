// Player class - handles player movement, physics, and state
export class Player {
  constructor(x, y, groundLevel) {
    this.x = x
    this.y = y
    this.groundLevel = groundLevel
    this.width = 40
    this.height = 60
    this.color = "#FF0000"
    this.speed = 5
    this.velocityY = 0
    this.jumpForce = -15
    this.isOnGround = true
    this.initialX = x
    this.initialY = y
  }

  jump() {
    this.velocityY = this.jumpForce
    this.isOnGround = false
  }

  update(gravity, keys) {
    // Horizontal movement
    if (keys.left) {
      this.x -= this.speed
    }
    if (keys.right) {
      this.x += this.speed
    }

    // Vertical movement (gravity and jumping)
    this.velocityY += gravity
    this.y += this.velocityY

    // Ground collision detection
    const playerBottom = this.y + this.height
    if (playerBottom >= this.groundLevel) {
      this.y = this.groundLevel - this.height
      this.velocityY = 0
      this.isOnGround = true
    } else {
      this.isOnGround = false
    }
  }

  reset() {
    this.x = this.initialX
    this.y = this.initialY
    this.velocityY = 0
    this.isOnGround = true
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

