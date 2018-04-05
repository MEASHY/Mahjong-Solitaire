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
                    this.currentSelection.resetTileHighlight(gameSession.colours.hint)
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
            this.hintButton = null
        }
        
        this.tileSelected.highlightTile(gameSession.colours.correct)
        this.currentSelection.highlightTile(gameSession.colours.correct)

        this.slideTileOut(this.tileSelected)
        this.slideTileOut(this.currentSelection)
        
        //delay for the animations
        setTimeout(function () {
            self.layout.removeTile(self.tileSelected)
            self.layout.removeTile(self.currentSelection)
            self.layout.removeHint()
            self.tileSelected = null
            self.currentSelection = null
            
            if (self.layout.size === 0) {
                self.scoreScreen(false)
                self.playSound('finishGame')
            } else {
                if(!self.layout.validMatchAvailable()) {
                    self.showShuffleButton()
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
            if (self.tileSelected !== null & self.currentSelection !== null) {
                self.tileSelected.resetTileHighlight(gameSession.colours.hint)
                self.tileSelected = self.currentSelection
                self.currentSelection.highlightTile(gameSession.colours.select)
            }
            
            if (++self.failedMatches === 3 & self.layout.validMatchAvailable() & gameSession.enabledHints & self.layout.activeHintTile1 === null) {
                self.showHintButton()
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

    showShuffleButton() {
        const UIDepth = 20000000001
        var s = gameSession
        var self = this
        console.log('No matches')

        var overlay = self.scene.add.sprite(540 * s.scale, 400 * s.scale, 'overlay').setInteractive()
        overlay.setScale(2 * s.scale * .9)
        overlay.setDepth(UIDepth - 1)

        var shuffleButton = self.scene.add.sprite(600, 50,'shuffle').setInteractive()
        shuffleButton.setDepth(UIDepth)
        
        // Shuffle is happening
        shuffleButton.on('pointerdown', function () {
            self.layout.shuffle()
            shuffleButton.destroy()
            self.failedMatches = 0
            overlay.destroy()
            //gives audio feedback to the player
            this.playSound('shuffle')
            
            if (!gameSession.practiceGame) {
                // Statistics for shuffling
                gameStats.timesShuffled += 1
                console.log('Shuffle: ',gameStats.timesShuffled)
            }
        }, self)
    }

    showHintButton() {
        const UIDepth = 20000000001
        const buttonDisplacementX = window.innerWidth - 500
        var s = gameSession

        // Hint button appears
        this.hintButton = this.scene.add.sprite(buttonDisplacementX, 50, 'hint').setInteractive()
        this.hintButton.setScale(s.scale)
        this.hintButton.setDepth(UIDepth)

        //gives audio feedback to the player
        this.playSound('hint')
        
        // Hint is being given
        this.hintButton.on('pointerdown', function() {
            this.tileSelected.resetTileHighlight(gameSession.colours.hint)
            this.tileSelected = null
            this.currentSelection.resetTileHighlight(gameSession.colours.hint)
            this.currentSelection = null
            
            this.layout.giveHint()
            this.failedMatches = 0
            this.hintButton.destroy()
            
            if (!gameSession.practiceGame) {
                // Statistics for giving hint
                gameStats.hintsUsed += 1
                console.log("Hint: ",gameStats.hintsUsed)
            }
            
        },this)
    }
    
    scoreScreen (timerDone) {
        const UIDepth = 20000000001
        
        // End the game here
        var overlay = this.scene.add.sprite(540 * gameSession.scale, 400 * gameSession.scale, 'overlay').setInteractive()
        overlay.setScale(2.1 * gameSession.scale)
        overlay.setDepth(UIDepth - 1)
        
        // Displays congratulations text
        var congratulations = this.scene.add.text(320 * gameSession.scale, 200, "Congratulations!", { font: '65px Arial', fill: '#000000', align: 'center' })
        congratulations.setDepth(UIDepth)
        
        if (!gameSession.practiceGame) {
            // Statistics for time taken to complete game
            gameSession.timer.pauseTimer()
            gameStats.endGameTime = gameSession.timer.timeLeft
            console.log("Duration: ", gameStats.startGameTime - gameStats.endGameTime)
            
            // Displays the proper message for ending a game
            if ((gameStats.startGameTime - gameStats.endGameTime) < 60) {              
                var endGameStatsText = this.scene.add.text(100, 200, 'You\'ve made ' + gameStats.correctMatches + 
                                                                    ' matches in\n' +  String(gameStats.startGameTime - gameStats.endGameTime) + 
                                                                    ' seconds.', { font: '65px Arial', fill: '#000000', align: 'center' })
            } else {
                if (Math.floor((gameStats.startGameTime - gameStats.endGameTime) / 60) == 1) {
                    var endGameStatsText = this.scene.add.text(100, 200, 'You\'ve made ' + gameStats.correctMatches + 
                                                                    ' matches in\n' +  String(Math.floor((gameStats.startGameTime - gameStats.endGameTime) / 60)) + 
                                                                    ' minute and ' + String((gameStats.startGameTime - gameStats.endGameTime) % 60) +' seconds.', { font: '65px Arial', fill: '#000000', align: 'center' })
                } else {
                    var endGameStatsText = this.scene.add.text(100, 200, 'You\'ve made ' + gameStats.correctMatches + 
                                                                    ' matches in\n' +  String(Math.floor((gameStats.startGameTime - gameStats.endGameTime) / 60)) + 
                                                                    ' minutes and ' + String((gameStats.startGameTime - gameStats.endGameTime) % 60) +' seconds.', { font: '65px Arial', fill: '#000000', align: 'center' })
                }
            }
            endGameStatsText.setDepth(UIDepth)
            Phaser.Display.Align.In.Center(endGameStatsText, overlay)
        }
        
        // Uses the continue button or finish button depending on if a game session has ended
        if (timerDone) {
            var finishButton = this.scene.add.sprite(540 * gameSession.scale, 600, 'finish').setInteractive()
            finishButton.setDepth(UIDepth)
            finishButton.on('pointerdown', function() {
                if (!gameSession.practiceGame) {
                    gameStats.completion = true
                }
                endGame(timerDone)
            },this)
        } else {
            var continueButton = this.scene.add.sprite(540 * gameSession.scale, 600, 'continue').setInteractive()
            continueButton.setDepth(UIDepth)
            continueButton.on('pointerdown', function() {
                if (!gameSession.practiceGame) {
                    gameStats.completion = true
                }
                endGame(timerDone)
            },this)
        }
    }
}
