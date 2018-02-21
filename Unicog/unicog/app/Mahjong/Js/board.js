class Board {
    constructor(scene) { 
        this.scene = scene
        
        this.tilesSelected = []
        this.currentSelection = null
        
        var json = this.scene.cache.json.get('jsonLayout')
        this.layout = new Layout(this.scene, json)
        
        var session = new GameSession()
        session.numChildren = json.header.numChildren
        var height = json.header.height
        
        for(var i = 1; i <= height; i++) {
            this.layout.addJsonLayer(json['layer'+i], i)
        }
        
        this.layout.buildHierarchy()
        this.layout.generateTiles()        
    };
   
    selectTile(tile) {
        
        // The tile can be selected
        if (tile.selectable) {
            this.currentSelection = tile
            // This tile has already been selected
            for (var i = 0; i < this.tilesSelected.length; i++) {
                if (this.currentSelection === this.tilesSelected[i]) {
                    this.tilesSelected.shift()
                    this.currentSelection.unhighlightTile()
                }
            }
            // Tile has not been selected yet
            this.tilesSelected.push(this.currentSelection)
            this.currentSelection.highlightTile()
            
            // Have selected 2 tiles
            if (this.tilesSelected.length === 2) {
                console.log("Test")
                this.checkMatch();
            }  
        }
    }

    checkMatch(){
        // The two tiles match, remove them
        console.log(this.tilesSelected[0].tile.texture.key)
        console.log(this.tilesSelected[1].tile.texture.key)
        if (this.tilesSelected[0].tile.texture.key === this.tilesSelected[1].tile.texture.key) {
            console.log("Match")
            this.layout.removeTile(this.tilesSelected[0])
            this.layout.removeTile(this.tilesSelected[1])
            this.tilesSelected = []
        } else {
            // The two tiles don't match so only select the most recent tile
            this.tilesSelected[0].unhighlightTile()
            this.tilesSelected.shift()
        }        
    }

    checkAvailableMoves() {
       
    }

    shuffle(){
        
    }
}