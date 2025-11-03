import { Controller } from "@hotwired/stimulus"

// This is our Game Controller - it manages the canvas and drawing
export default class extends Controller {
  // 'static targets' tells Stimulus which elements in our HTML we want to access
  static targets = ["canvas"]

  // 'connect' is called automatically when this controller is attached to the page
  connect() {
    console.log("Game controller connected!")
    
    // Get the canvas element and its drawing context
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext("2d")
    
    // Draw our first character (a red rectangle for now)
    this.draw()
  }

  // This method draws our player character on the canvas
  draw() {
    // Clear the entire canvas first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw a rectangle (this will be our player character)
    // fillStyle sets the color
    this.ctx.fillStyle = "#FF0000" // Red color
    
    // fillRect(x, y, width, height) draws a filled rectangle
    // x=50, y=300 means 50 pixels from left, 300 pixels from top
    // width=40, height=60 means 40px wide, 60px tall
    this.ctx.fillRect(50, 300, 40, 60)
  }
}

