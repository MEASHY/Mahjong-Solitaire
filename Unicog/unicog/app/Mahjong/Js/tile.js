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
    
    addJsonLayer(layer, depth) {
        var generated = []
        console.log("tile layer!")
        //console.log(layer.length)
        for (var i = 0; i < layer.length; i++) {
            var row = []
            for (var j = 0; j < layer[i].length; j++) {
                if(layer[i][j] == 1) {
                    row.push(new TileNode(this.state, j, i, depth))
                }else {
                    row.push(null)
                }
            }
            generated.push(row)
        }
        this.layers.push(generated)
    }
    
    generateTest() {
        var layer = []
        for (var i = 0; i < 3; i++) {
            var row = []
            for (var j = 0; j < 4; j++) {
                row.push(new TileNode(this.state, j, i, 1, "1Dot"))
            }
            layer.push(row)
        }
        this.layers.push(layer)
    } 
    
    setAll() {
        //console.log("set all!")
        for (var i = 0; i < this.layers.length; i++) {
            //console.log("layer to set")
            //console.log(this.layers[i])
            this.setLayer(this.layers[i])
        }
    }
    
    setLayer(layer) {
        //console.log("setting layer")
        for (var i = 0; i < layer.length; i++) {
            for (var j = 0; j < layer[i].length; j++) {
                //console.log(layer[i][j])
                if (layer[i][j] != null) {
                    layer[i][j].setTile("1Dot")
                }
            }
        }
    }
}


class TileNode {
    constructor(state, x, y, depth, img = null){
        //console.log("tile constructor")
        this.state = state,
        this.x = x*100 + 50*depth,
        this.y = y*160 + 90*depth,
        this.depth = depth,
        this.img = img,
        this.parents = [], 
        this.children = [],
        this.tile = null
        //console.log(x + " : " + y)
        //this.tile = state.add.sprite(this.x, this.y, img)
	//console.log(this.tile)
        
        //this.tile.setInteractive()
        
    }
    
    highlightTile() {
    if (this.state.tileSelected != null) {
        this.state.tileSelected.unhighlightTile();
    }
    
	this.tile.setTint(0xff0000);
	this.state.tileSelected = this;
    }
    
    unhighlightTile() {
        this.tile.clearTint();
    }

    
    setTile(img) {
    this.tile = this.state.add.sprite(this.x, this.y, img).setInteractive();
	// set onclick for tile
    var self = this;
	this.tile.on('pointerdown', function (pointer) {  
	    self.highlightTile();
        });
    }
    
    isSet() {
        if (this.tile == null) {
            return false
        }
        return true
    }
}