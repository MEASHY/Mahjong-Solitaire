/** Class representing a Mahjong board. */
class Board {
    /**
     * Create a Board 
     * <p>
     * Also initializes a layout
     * @param {context} scene - The scene in which the sprite resides.
     * @see Layout
     */
    constructor (scene) { 
        this.scene = scene
        
        this.tileSelected = null
        this.currentSelection = null
        
        this.failedMatches = 0
        
        var gameSession = new GameSession()
        this.layout = new Layout(this.scene)
        this.hintButton = null
        
        for (var i = 1; i <= this.layout.height; i++) {
            this.layout.addJsonLayer(gameSession.layout['layer'+i], i)
        }
        gameSession.sizeX = this.layout.layers[0][0].length
        gameSession.sizeY = this.layout.layers[0].length
        
        this.layout.buildHierarchy()
        this.layout.generateTiles() 
        if (gameSession.beginnerMode) {
            this.layout.initializeBeginnerMode()
        } 
    }
    /**
     * Selects a given TileNode
     * <p>
     * If a tile was previously selected check for a match
     * @param {TileNode} tile - The hexadecimal value used to tint the sprite
     */
    selectTile (tile) {
        // The tile can be selected
        if (tile.selectable) {
            this.currentSelection = tile
            
            if (this.tileSelected != null) {
                if (this.tileSelected == this.currentSelection) {
                    this.currentSelection.unhighlightTile()
                    this.tileSelected = null
                    
                    // Statistics for deselections
                    gameStats.deselections += 1
                    console.log("Deselect: ",gameStats.deselections)
                    
                } else {
                    this.checkMatch()
                }
            } else {
                // Tile has not been selected yet
                this.currentSelection.highlightTile()
                this.tileSelected = this.currentSelection
                
                // Statistics for selections
                gameStats.selections += 1
                console.log("Select: ",gameStats.selections)
            }
        }
    }
    /**
     * Checks if the player has made a successful match
     * <p>
     * In the case of a match the TileNode will be removed along with the previously selected TileNode
     * In the case of The TileNode already being selected it will be deselected
     * In the case of a mismatch The TileNode will be highlighted and the previous deselected
     */
    checkMatch () {
        const UIDepth = 20000000001
        
        // The two tiles match, remove them
        if (this.tileSelected.tile.texture.key === this.currentSelection.tile.texture.key) {
            this.layout.removeTile(this.tileSelected)
            this.layout.removeTile(this.currentSelection)
            this.tileSelected = null
            this.currentSelection = null
            
            this.failedMatches = 0
            
            // Statistics for correct match
            gameStats.correctMatches += 1
            console.log("CM: ",gameStats.correctMatches)
            
            // Keeps the layout updated
            this.layout.size -= 2
            
            if (this.hintButton !== null) {
                this.hintButton.destroy()
                this.hintButton = null
            }
            if (this.layout.size === 0) {
                // End the game here
                var overlay = this.scene.add.sprite(500, 500, 'overlay').setInteractive()
                overlay.setScale(10)
                overlay.setDepth(UIDepth - 1)
                
                // Statistics for time taken to complete game
                gameStats.endGameTime = gameSession.timer.timeLeft
                console.log("Duration: ", gameStats.startGameTime - gameStats.endGameTime)
                
                var continueButton = this.scene.add.sprite(400, 500, 'continue').setInteractive()
                continueButton.setDepth(UIDepth)
                continueButton.on('pointerdown', function() {
                    gameStats.completion = true
                    endGame()
                },this)
            }
            if(!this.layout.validMatchAvailable() && this.layout.size !== 0)
            {
                console.log("no matches")
                var shuffleButton = this.scene.add.sprite(600, 50,'shuffle').setInteractive()
                shuffleButton.setDepth(UIDepth)
                
                // Shuffle is happening
                shuffleButton.on('pointerdown', function() {
                    this.layout.shuffle()
                    shuffleButton.destroy()
                    this.failedMatches = 0
                    
                    // Statistics for shuffling
                    gameStats.timesShuffled += 1
                    console.log("Shuffle: ",gameStats.timesShuffled)
                },this)
                
                
            }

            var music = this.scene.sound.add('correct')
            music.play()
        } else {
            // The two tiles don't match so only select the most recent tile
            this.tileSelected.unhighlightTile()
            this.tileSelected = this.currentSelection
            this.currentSelection.highlightTile()
            
            // Statistics for incorrect match 
            gameStats.incorrectMatches += 1
            console.log("ICM: ",gameStats.incorrectMatches)
            
            // Statistics for selections
            gameStats.selections += 1
            console.log("Select: ",gameStats.selections)
            
            var music = this.scene.sound.add('wrong')
            music.play()

            if (++this.failedMatches === 3 & this.layout.validMatchAvailable()) {
                
                // Hint button appears
                this.hintButton = this.scene.add.sprite(700, 50, 'hint').setInteractive()
                this.hintButton.setDepth(UIDepth)
                
                // Hint is being given
                this.hintButton.on('pointerdown', function() {
                    this.layout.giveHint()
                    this.failedMatches = 0
                    this.hintButton.destroy()
                    
                    // Statistics for giving hint
                    gameStats.hintsUsed += 1
                    console.log("Hint: ",gameStats.hintsUsed)
                    
                },this)
            }
        }
    }
}
