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
        const UIDepth = 20000000001

        this.scene = scene
        
        this.tileSelected = null
        this.currentSelection = null
        this.hintedTiles = null
        this.animating = false
        
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
        if (tile.selectable & !this.animating) {
            this.currentSelection = tile
            
            this.playSound('click')
            
            if (this.tileSelected != null) {
                if (this.tileSelected == this.currentSelection) {
                    if (this.hintedTiles && this.hintedTiles.indexOf(this.currentSelection) > -1) {
                        this.currentSelection.highlightTile(gameSession.colours.hint)
                    } else {
                        this.currentSelection.unhighlightTile()
                    }
                    this.tileSelected = null
                    
                    if (!gameSession.practiceGame) {
                        // Statistics for deselections
                        gameStats.deselections += 1
                        console.log("Deselect: ",gameStats.deselections)
                    }
                    
                } else {
                    this.checkMatch()
                }
            } else {
                // Tile has not been selected yet
                this.currentSelection.highlightTile(gameSession.colours.select)
                this.tileSelected = this.currentSelection
                
                if (!gameSession.practiceGame) {
                    // Statistics for selections
                    gameStats.selections += 1
                    console.log("Select: ",gameStats.selections)
                }
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
        this.animating = true
        
        // The two tiles match, remove them
        if (this.tileSelected.tile.texture.key === this.currentSelection.tile.texture.key) {
            this.tileMatch()
        } else {
            this.tileMismatch()
        }
    }

    tileMatch () {
        const UIDepth = 20000000001
        const animationDelay = 500
        var self = this

        this.failedMatches = 0
        
        if (!gameSession.practiceGame) {
            // Statistics for correct match
            gameStats.correctMatches += 1
            console.log("CM: ",gameStats.correctMatches)
        }
        
        // Keeps the layout updated
        this.layout.size -= 2

        //gives audio feedback to the player
        this.playSound('correct')
        
        if (this.hintButton !== null) {
            this.hintButton.destroy()
        }
        if (this.hintedTiles) {
            this.removeHint()
        }
        
        this.tileSelected.highlightTile(gameSession.colours.correct)
        this.currentSelection.highlightTile(gameSession.colours.correct)

        this.slideTileOut(this.tileSelected)
        this.slideTileOut(this.currentSelection)
        
        //delay for the animations
        setTimeout(function () {
            self.layout.removeTile(self.tileSelected)
            self.layout.removeTile(self.currentSelection)
            self.tileSelected = null
            self.currentSelection = null
            
            if (self.layout.size === 0) {
                self.scoreScreen(false)
                self.playSound('finishGame')
            } else {
                if(!self.layout.validMatchAvailable()) {
                    self.scene.buttons.shuffle.toggleVisibility()
                    self.scene.buttons.overlay.toggleVisibility()
                    self.scene.buttons.shuffleText.toggleVisibility()
                }
            }
            self.animating = false
        }, animationDelay)
    }

    tileMismatch() {
        const UIDepth = 20000000001
        const animationDelay = 300
        var self = this
        
        // The two tiles don't match so only select the most recent tile
        this.tileSelected.highlightTile(gameSession.colours.incorrect)
        this.currentSelection.highlightTile(gameSession.colours.incorrect)
        
        if (!gameSession.practiceGame) {
            // Statistics for incorrect match 
            gameStats.incorrectMatches += 1
            console.log("ICM: ",gameStats.incorrectMatches)
            
            // Statistics for selections
            gameStats.selections += 1
            console.log("Select: ",gameStats.selections)
        }
        
        //gives audio feedback to the player
        this.playSound('incorrect')

        setTimeout(function () {
            if (self.tileSelected !== null) {
                if (self.hintedTiles && self.hintedTiles.indexOf(self.tileSelected) > -1) {
                    self.tileSelected.highlightTile(gameSession.colours.hint)
                } else {
                    self.tileSelected.unhighlightTile()
                }
                self.tileSelected = self.currentSelection
                self.currentSelection.highlightTile(gameSession.colours.select)
            }
            if (++self.failedMatches === 3 && self.layout.validMatchAvailable() 
                                           && gameSession.enabledHints 
                                           && !self.hintedTiles) {
                self.scene.buttons.hint.toggleVisibility()
                self.playSound('hint')
            }
            
            self.animating = false
        }, animationDelay)
    }

    playSound(soundName) {
        var s = gameSession
        if (s.sound) {
            var music = this.scene.sound.add(soundName)
            music.play()
        }
        
    }

    slideTileOut(tilenode) {
        var neighbour = this.layout.findNeighbours(tilenode)[0]
        if (neighbour === undefined || neighbour.x < tilenode.x) {
            var destination = tilenode.tile.x + 100
            console.log('slide left')
        } else {
            var destination = tilenode.tile.x - 100
            console.log('slide right')
        }
        
        tilenode.state.tweens.add({
                targets: tilenode.tile,
                x: { value: destination, duration: 1000, ease: 'Power2' },
                alpha: { value: 0, duration: 500, ease: 'Power2'}
            })
    }
    pulsateTile(tilenode) {
        var scaleTargetX = tilenode.tile.scaleX * 1.2
        var scaleTargetY = tilenode.tile.scaleY * 1.2
        tilenode.state.tweens.add({
                targets: tilenode.tile,
                yoyo: true,
                repeat: 2,
                scaleX: { value: scaleTargetX, duration: 500, ease: 'Power2' },
                scaleY: { value: scaleTargetY, duration: 500, ease: 'Power2' }
            })
    }
    
    /**
     * Unhighlights any remaining tiles from an active hint.
     */
    removeHint () {
        for (var i = 0; i < this.hintedTiles.length; i++) {
            if (this.hintedTiles[i] !== null) {
                this.hintedTiles[i].unhighlightTile()
            }
        }
        this.hintedTiles = null
    }
    
    scoreScreen (timerDone) {
        const UIDepth = 20000000001
        var s = gameSession
        // End the game here
        var overlay = this.scene.add.sprite(540 * s.scale, 400 * s.scale, 'overlay').setInteractive()
        overlay.setScale(2.1 * s.scale)
        overlay.setDepth(UIDepth - 1)

        var congratulations = this.scene.add.text(320 * s.scale, 200, "Congratulations!", { font: '64px Arial', fill: '#000000'})
        congratulations.setDepth(UIDepth)
        var endGameStatsText = this.scene.add.text(100, 200, 'You\'ve made ' + 
                                                                        gameStats.correctMatches + 
                                                                        ' matches\n        in ' +  
                                                                        String(gameStats.startGameTime - gameStats.endGameTime) + 
                                                                        ' seconds.', { font: '64px Arial',
                                                                                        fill: '#000000'})
        endGameStatsText.setDepth(UIDepth)
        Phaser.Display.Align.In.Center(endGameStatsText, overlay)
        
        if (!gameSession.practiceGame) {
            // Statistics for time taken to complete game
            gameSession.timer.pauseTimer()
            gameStats.endGameTime = gameSession.timer.timeLeft
            console.log("Duration: ", gameStats.startGameTime - gameStats.endGameTime)
        }
        
        var continueButton = this.scene.add.sprite(540 * s.scale, 600, 'continue').setInteractive()
        continueButton.setDepth(UIDepth)
        continueButton.on('pointerdown', function() {
            if (!gameSession.practiceGame & !timerDone) {
                gameStats.completion = true
            }
            endGame(timerDone)
        },this)
    }
}
