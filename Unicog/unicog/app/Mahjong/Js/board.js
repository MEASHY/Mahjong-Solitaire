class Board {
    constructor (scene) { 
        this.scene = scene
        
        this.tileSelected = null
        this.currentSelection = null
        
        this.failedMatches = 0
        
        var session = new GameSession()
        this.layout = new Layout(this.scene)
        
        for (var i = 1; i <= this.layout.height; i++) {
            this.layout.addJsonLayer(session.layout['layer'+i], i)
        }
        session.sizeX = this.layout.layers[0][0].length
        session.sizeY = this.layout.layers[0].length
        
        this.layout.buildHierarchy()
        this.layout.generateTiles() 
        if (session.beginnerMode) {
            this.layout.initializeBeginnerMode()
        } 
    }
   
    selectTile (tile) {
        // The tile can be selected
        if (tile.selectable) {
            this.currentSelection = tile
            
            if (this.tileSelected != null) {
                if (this.tileSelected == this.currentSelection) {
                    this.currentSelection.unhighlightTile()
                    this.tileSelected = null
                } else {
                    this.checkMatch()
                }
            } else {
                // Tile has not been selected yet
                this.currentSelection.highlightTile()
                this.tileSelected = this.currentSelection
            }
        }
    }

    checkMatch () {
        // The two tiles match, remove them
        if (this.tileSelected.tile.texture.key === this.currentSelection.tile.texture.key) {
            this.layout.removeTile(this.tileSelected)
            this.layout.removeTile(this.currentSelection)
            this.tileSelected = null
            this.currentSelection = null
            
            this.failedMatches = 0
          
            // Keeps the layout updated
            this.layout.size -= 2
            if (this.layout.size === 0) {
                //we want to end the game here
                var overlay = this.scene.add.sprite(500, 500, 'overlay').setInteractive()
                overlay.setScale(10)
                overlay.setDepth(20000000000)

                var continueButton = this.scene.add.sprite(400, 500, 'continue').setInteractive()
                continueButton.setDepth(20000000001)
                continueButton.on('pointerdown', function() {
                    endGame()
                },this)
            }
            if(!this.layout.validMatchAvailable() && (!this.layout.size === 0))
            {
                console.log("no matches")
                var shuffleButton = this.scene.add.sprite(600, 50,'shuffle').setInteractive()
                shuffleButton.setDepth(20000000001)
                shuffleButton.on('pointerdown', function() {
                    this.layout.shuffle()
                    shuffleButton.destroy()
                },this)
                
            }
        } else {
            // The two tiles don't match so only select the most recent tile
            this.tileSelected.unhighlightTile()
            this.tileSelected = this.currentSelection
            this.currentSelection.highlightTile()
            
            if (++this.failedMatches === 3) {
                var hintButton = this.scene.add.sprite(700, 50, 'hint').setInteractive()
                hintButton.setDepth(20000000001)
                hintButton.on('pointerdown', function() {
                    this.layout.giveHint()
                    this.failedMatches = 0
                    hintButton.destroy()
                },this)
            }
        }
    }
    
    checkAvailableMoves () {
       
    }
}
