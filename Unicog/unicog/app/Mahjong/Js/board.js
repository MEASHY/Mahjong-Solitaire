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
            this.layout.InitializeBeginnerMode()
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
        } else {
            // The two tiles don't match so only select the most recent tile
            this.tileSelected.unhighlightTile()
            this.tileSelected = this.currentSelection
            this.currentSelection.highlightTile()
            
            if (++this.failedMatches === 3) {
                this.layout.giveHint()
                this.failedMatches = 0
            }
        }
    }
    
    checkAvailableMoves () {
       
    }

    shuffle () {
        
    }
}
