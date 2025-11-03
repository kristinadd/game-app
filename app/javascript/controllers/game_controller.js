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
      color: "#FF0000"    // Player color (red)
    }
    
    // Draw our first character (a red rectangle for now)
    this.draw()
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
