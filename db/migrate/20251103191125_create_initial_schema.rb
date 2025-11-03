class CreateInitialSchema < ActiveRecord::Migration[8.0]
  # This is an empty migration to generate schema.rb
  # Our game doesn't need a database, but Rails CI requires schema.rb to exist
  def change
    # No database tables needed for this canvas-based game
  end
end
