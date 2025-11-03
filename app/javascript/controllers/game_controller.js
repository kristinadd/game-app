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
    
    // Initialize player configuration
    // This object stores all the player's properties in one place
    this.player = {
      x: 50,              // Starting X position (pixels from left)
      y: 300,             // Starting Y position (pixels from top)
      width: 40,          // Player width in pixels
      height: 60,         // Player height in pixels
      color: "#FF0000",   // Player color (red)
      speed: 5            // How many pixels the player moves per frame
    }
    
    // Track which keys are currently pressed
    // This allows smooth movement when holding keys
    this.keys = {
      left: false,
      right: false
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
  
  // Update game state - called every frame
  update() {
    // Move player left if left arrow key is pressed
    if (this.keys.left) {
      this.player.x -= this.player.speed
    }
    
    // Move player right if right arrow key is pressed
    if (this.keys.right) {
      this.player.x += this.player.speed
    }
    
    // Keep player within canvas boundaries
    // Prevent moving off the left edge
    if (this.player.x < 0) {
      this.player.x = 0
    }
    
    // Prevent moving off the right edge
    // Canvas width (800) minus player width (40) = 760
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width - this.player.width
    }
  }

  // This method draws our player character on the canvas
  draw() {
    // Clear the entire canvas first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw the player character using properties from the player object
    // fillStyle sets the color from the player configuration
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
