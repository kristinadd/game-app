import { Controller } from "@hotwired/stimulus"

// This is our Game Controller - it manages the canvas and drawing
export default class extends Controller {
  // 'static targets' tells Stimulus which elements in our HTML we want to access
  static targets = ["canvas"]

  // 'connect' is called automatically when this controller is attached to the page
  connect() {
    // Get the canvas element and its drawing context
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext("2d")
    
    // Calculate ground position (bottom 15% of canvas is ground)
    this.groundLevel = this.canvas.height - (this.canvas.height * 0.15)
    
    // Initialize player configuration
    // This object stores all the player's properties in one place
    this.player = {
      x: 50,              // Starting X position (pixels from left)
      y: this.groundLevel - 60,  // Starting Y position (on the ground)
      width: 40,          // Player width in pixels
      height: 60,         // Player height in pixels
      color: "#FF0000",   // Player color (red)
      speed: 5,           // How many pixels the player moves per frame (horizontal)
      velocityY: 0,      // Vertical velocity (positive = down, negative = up)
      jumpForce: -15,     // How strong the jump is (negative because up is negative Y)
      isOnGround: true    // Track if player is on the ground
    }
    
    // Game physics constants
    this.gravity = 0.8    // How fast player falls (pixels per frame squared)
    
    // Track which keys are currently pressed
    // This allows smooth movement when holding keys
    this.keys = {
      left: false,
      right: false,
      jump: false
    }
    
    // Set up keyboard event listeners
    this.setupKeyboardListeners()
    
    // Start the game loop
    this.startGameLoop()
  }
  
  // Set up keyboard event listeners to track key presses
  setupKeyboardListeners() {
    // Store bound methods so we can remove them later (cleanup)
    this.boundHandleKeyDown = (event) => this.handleKeyDown(event)
    this.boundHandleKeyUp = (event) => this.handleKeyUp(event)
    
    // Listen for when a key is pressed down
    document.addEventListener("keydown", this.boundHandleKeyDown)
    
    // Listen for when a key is released
    document.addEventListener("keyup", this.boundHandleKeyUp)
  }
  
  // Clean up when the controller is disconnected (Stimulus lifecycle)
  disconnect() {
    // Remove event listeners to prevent memory leaks
    if (this.boundHandleKeyDown) {
      document.removeEventListener("keydown", this.boundHandleKeyDown)
    }
    if (this.boundHandleKeyUp) {
      document.removeEventListener("keyup", this.boundHandleKeyUp)
    }
  }
  
  // Handle when a key is pressed down
  handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      this.keys.left = true
    } else if (event.key === "ArrowRight") {
      this.keys.right = true
    } else if (event.key === " " || event.key === "Spacebar") {
      // Spacebar to jump (only if on ground)
      event.preventDefault() // Prevent page scroll when pressing spacebar
      if (this.player.isOnGround) {
        this.jump()
      }
    }
  }
  
  // Handle when a key is released
  handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
      this.keys.left = false
    } else if (event.key === "ArrowRight") {
      this.keys.right = false
    }
  }
  
  // Start the game loop - this runs continuously to update and draw the game
  startGameLoop() {
    // requestAnimationFrame is a browser API that runs a function before the next repaint
    // This gives us smooth animation at ~60 frames per second
    const gameLoop = () => {
      this.update()  // Update game state (position, etc.)
      this.draw()     // Draw everything on the canvas
      requestAnimationFrame(gameLoop)  // Schedule the next frame
    }
    
    gameLoop()  // Start the loop
  }
  
  // Make the player jump
  jump() {
    this.player.velocityY = this.player.jumpForce  // Set upward velocity
    this.player.isOnGround = false  // Player is now in the air
  }
  
  // Update game state - called every frame
  update() {
    // Horizontal movement (left/right)
    if (this.keys.left) {
      this.player.x -= this.player.speed
    }
    
    if (this.keys.right) {
      this.player.x += this.player.speed
    }
    
    // Keep player within canvas boundaries (horizontal)
    if (this.player.x < 0) {
      this.player.x = 0
    }
    
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width - this.player.width
    }
    
    // Vertical movement (gravity and jumping)
    // Apply gravity - constantly pulls player down
    this.player.velocityY += this.gravity
    
    // Update player's Y position based on velocity
    this.player.y += this.player.velocityY
    
    // Ground collision detection
    // Calculate where the bottom of the player is
    const playerBottom = this.player.y + this.player.height
    
    // If player hits or goes below the ground
    if (playerBottom >= this.groundLevel) {
      this.player.y = this.groundLevel - this.player.height  // Snap to ground
      this.player.velocityY = 0  // Stop falling
      this.player.isOnGround = true  // Player is now on ground
    } else {
      this.player.isOnGround = false  // Player is in the air
    }
  }

  // This method draws our player character on the canvas
  draw() {
    // Clear the entire canvas first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw the ground (so we can see where the player lands)
    this.ctx.fillStyle = "#8B4513"  // Brown color for ground
    this.ctx.fillRect(0, this.groundLevel, this.canvas.width, this.canvas.height - this.groundLevel)
    
    // Draw the player character using properties from the player object
    this.ctx.fillStyle = this.player.color
    
    // fillRect draws a filled rectangle using player's position and size
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    )
  }
}
