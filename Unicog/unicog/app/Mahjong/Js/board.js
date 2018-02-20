class Board {
    constructor(scene) { 
        this.scene = scene
        //console.log(this.game)
        console.log("new layout!")
        this.layout = new Layout(this.scene, 36, 1)
        this.currentSelection = null
        this.tilesSelected = null
        
        //layout.generateTest()
        //var tile = new tileNode(this.scene, 1, 1, 1, "1Dot")
        //console.log(tile.isSet())
        //var tile = new TileNode(this.scene, 1, 1, 1)
        //tile.setTile("1Dot")
        
        
        
        
        var json = this.scene.cache.json.get('jsonLayout')
        var depth = json.header.depth
        console.log("DEPTH = "+depth)
        for(var i = 1; i <= depth; i++) {
            this.layout.addJsonLayer(json['layer'+i], i)
        }
        console.log(this.layout.layers)
        this.layout.setAll()
    }
    
    selectTile(tile) {
        if (this.currentSelection != null) {
            this.currentSelection.unhighlightTile()
        }
        this.currentSelection = tile
        this.currentSelection.highlightTile()
    }

    checkMatch(){
        
    }

    checkAvailableMoves() {
       
    }

    shuffle(){
        
    }
}