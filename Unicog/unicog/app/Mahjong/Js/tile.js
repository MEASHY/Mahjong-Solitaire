class Layout {
    constructor(state, size, depth){
        console.log("layout constructor")
        this.state = state,
        this.size = size
        this.depth = depth
        this.uniqueTiles = null
        this.maxDuplicates = null
        this.layers = []
        this.roots = []
    }
    
    addJsonLayer(layer) {
        
        this.layers.push([null])
    }
    
    generateTest() {
        var layer = []
        for (var i = 0; i < 3; i++) {
            var row = []
            for (var j = 0; j < 4; j++) {
                row.push(new TileNode(this.state, j, i, 1, "1Dot"))
            }
        }
        this.layers.push(layer)
    } 
}


class TileNode {
    constructor(state, x, y, depth, img){
        //console.log("tile constructor")
        this.state = state,
        this.x = x*100 + 50,
        this.y = y*160 + 90,
        this.depth = depth,
        this.img = img,
        this.parents = [], 
        this.children = [],
        //console.log(x + " : " + y)
        this.tile = state.add.sprite(this.x, this.y, img)
        //console.log(this.tile)
        
        this.tile.setInteractive()
        
    }
    
    setTile(img) {
        this.tile = state.add.sprite(this.x, this.y, img)
    }
    
    isSet() {
        if (this.tile == null) {
            return false
        }
        return true
    }
}