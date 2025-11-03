import { Controller } from "@hotwired/stimulus"
import { GameEngine } from "game/game_engine"

// Stimulus Controller - handles DOM interaction and connects to GameEngine
export default class extends Controller {
  static targets = ["canvas", "restartButton"]

  connect() {
    // Get canvas element and context
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext("2d")

    // Calculate ground position
    const groundLevel = this.canvas.height - (this.canvas.height * 0.15)

    // Initialize game engine
    this.gameEngine = new GameEngine(this.canvas, this.ctx, groundLevel)

    // Set up keyboard event listeners
    this.setupKeyboardListeners()

    // Start the game loop
    this.gameEngine.startGameLoop()
  }

  setupKeyboardListeners() {
    // Store bound methods for cleanup
    this.boundHandleKeyDown = (event) => {
      // Prevent default only for spacebar (to prevent page scroll)
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault()
      }
      this.gameEngine.handleKeyDown(event.key)
    }
    this.boundHandleKeyUp = (event) => {
      this.gameEngine.handleKeyUp(event.key)
    }

    // Add event listeners
    document.addEventListener("keydown", this.boundHandleKeyDown)
    document.addEventListener("keyup", this.boundHandleKeyUp)
  }

  disconnect() {
    // Clean up event listeners
    if (this.boundHandleKeyDown) {
      document.removeEventListener("keydown", this.boundHandleKeyDown)
    }
    if (this.boundHandleKeyUp) {
      document.removeEventListener("keyup", this.boundHandleKeyUp)
    }
  }

  // Stimulus action - called when restart button is clicked
  restart() {
    this.gameEngine.reset()
  }
}
