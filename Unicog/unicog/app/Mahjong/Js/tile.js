class Layout {
    constructor(state, json){
        console.log("layout constructor")
        console.log(json)
        this.state = state,
        this.size = json.header.size,
        this.height = json.header.height,
        this.uniqueTiles = json.header.uniqueTiles,
        this.maxDuplicates = json.header.maxDuplicates,
        this.numChildren = json.header.numChildren,
        this.layers = [],
        this.roots = []
    }
    
    addJsonLayer(layer, height) {
        var generated = []
        console.log("tile layer!")
        //console.log(layer.length)
        for (var i = 0; i < layer.length; i++) {
            var row = []
            for (var j = 0; j < layer[i].length; j++) {
                if(layer[i][j] == 1) {
                    row.push(new TileNode(this.state, j, i, height))
                }else {
                    row.push(null)
                }
            }
            generated.push(row)
        }
        this.layers.push(generated)
    }
    
    buildHierarchy() {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if (this.layers[i][j][k] == null) {
                        continue
                    }
                    if (this.layers[i][j][k].parents.length < 1){
                        //console.log(i, j, k)
                        this.roots.push(this.layers[i][j][k].findChildren(this, this.numChildren))
                    }
                }
            }
        }
        console.log("roots")
        console.log(this.roots)
    }
    
    findEmptyNeighbors(tile) {
        if (tile == null) {return false}
        var neighbors = []
        for (var i = tile.x - 1; i > 0; i--) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                   neighbors.push(this.layers[tile.z][tile.y][i]) 
                   break
               }
            }
        }
        for (var i = tile.x + 1; i < this.layers[tile.z][tile.y].length - 1; i++) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                    neighbors.push(this.layers[tile.z][tile.y][i])
                    break
               }
            }
        }
        return neighbors
    }
    
    generateTiles() {
        var session = new GameSession()
        var counts = new Array(Math.min(this.uniqueTiles, session.tileSetSize)).fill(0)
        var possible = [...Array(counts.length).keys()]
        console.log(counts)
        console.log(possible)
        var openTiles = []
        
        //get the positions available to fill
        for (var i = 0; i < this.layers[0].length; i++) {
            for (var j = 0; j < this.layers[0][i].length; j++) {
                if (this.layers[0][i][j] != null) {
                    openTiles.push(this.layers[0][i][j])
                    break
                }
            }
            for (var j = this.layers[0][i].length - 1; j >= 0; j--) {
                if (this.layers[0][i][j] != null) {
                    if(this.layers[0][i][j] != openTiles[openTiles.length-1]) {
                        openTiles.push(this.layers[0][i][j])
                    }
                    break
                }
            }
        }
        console.log(openTiles)
        
        for (var n = 0; n < this.size/2; n++) {
            //console.log("debug---------------")
            //console.log(counts)
            //console.log(possible)
            //console.log(openTiles)
            //console.log("debug---------------")
            
            
            //get tile
            var randTile = Math.floor(Math.random() * Math.floor(possible.length))
            
            //get 2 positions that are not the same
            var randPos1 = Math.floor(Math.random() * Math.floor(openTiles.length))
            var pos1 = openTiles.splice( randPos1, 1 )[0]
            var randPos2 = Math.floor(Math.random() * Math.floor(openTiles.length))
            var pos2 = openTiles.splice( randPos2, 1 )[0]
            
            
            //console.log(n)
            //console.log(this.size/2)
            
            
            //assign the tile to the two selected positions
            pos1.setTile("tile"+possible[randTile])
            pos2.setTile("tile"+possible[randTile])
            
            //if we have placed as many pairs of this tile as possible remove from list
            if (++counts[possible[randTile]] == this.maxDuplicates) {
                possible.splice( randTile, 1 )
                //console.log(possible)
            }
            
            //console.log(counts)
            //console.log(randTile, randPos1, randPos2)
            console.log(n)
            console.log("tile"+possible[randTile])
            console.log(pos1)
            console.log(pos2)
            //console.log("Pos-----------------")
            
            var tilesToPush = []
            
            
            //find the new positions opened by the assignment of position 1
            for (var i = 0; i < pos1.parents.length; i++){
                //console.log(pos1.parents)
                if (pos1.parents[i].allChildrenGenerated() &&  this.findEmptyNeighbors(pos1.parents[i]).length < 2){
                    console.log("valid parent")
                    tilesToPush.push(pos1.parents[i])
                }
            }
          
            
            //find the new positions opened by the assignment of position 2
            for (var i = 0; i < pos2.parents.length; i++){
                if (pos2.parents[i].allChildrenGenerated() && this.findEmptyNeighbors(pos1.parents[i]).length < 2){
                    console.log("valid parent")
                    tilesToPush.push(pos2.parents[i])
                }
            }
           
            
            
            var a = this.findEmptyNeighbors(pos1)
            var b = this.findEmptyNeighbors(pos2)
            tilesToPush = tilesToPush.concat(a,b)
            
            var tilesPushed = []
            for (i = 0; i < tilesToPush.length; i++) {
                var duplicate = false
                for (j = 0; j < openTiles.length; j++){
                    if (tilesToPush[i] === openTiles[j]) {
                        console.log("duplicate")
                        console.log(openTiles[j])
                        duplicate = true
                        break
                    }
                }
                if (!duplicate) {
                    tilesPushed.push(tilesToPush[i])
                    openTiles.push(tilesToPush[i])
                }
            }
        }
        
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
                    layer[i][j].setTile("tile0")
                }
            }
        }
    }
}


class TileNode {
    constructor(state, x, y, height){
        //console.log("tile constructor")
        var session = new GameSession()
        this.state = state,
        this.x = x,
        this.y = y,
        this.z = height-1,
        this.xPos = x*100 + 50*height,
        this.yPos = y*160 + 80*height + 10,
        this.height = height,
        this.parents = [], 
        this.children = [],
        this.tile = null
        //console.log(x + " : " + y)
        //this.tile = state.add.sprite(this.x, this.y, img)
        //console.log(this.tile)
        
        //this.tile.setInteractive()
        
    }
    
    setTile(img) {
        this.tile = this.state.add.sprite(this.xPos, this.yPos, img)
        this.tile.setDepth(this.height*1000 + this.y)
    }
    
    isSet() {
        if (this.tile == null) {
            return false
        }
        return true
    }
    
    allChildrenGenerated() {
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].isSet()){
                return false
            }            
        }
        return true
    }
    
    findChildren(layout, numChildren) {
        if (this.height == 1){
            return this
        }
        
        var children = []
        if (numChildren == 1) {
            children.push(layout.layers[this.z-1][this.y][this.x])
        }
        if (numChildren == 2) {
            children.push(layout.layers[this.z-1][this.y][this.x])
            children.push(layout.layers[this.z-1][this.y][this.x+1])
        }
        if (numChildren == 4) {
            children.push(layout.layers[this.z-1][this.y][this.x])
            children.push(layout.layers[this.z-1][this.y][this.x+1])
            children.push(layout.layers[this.z-1][this.y+1][this.x])
            children.push(layout.layers[this.z-1][this.y+1][this.x+1])
        }
        //console.log("children:")
        //console.log(children)
        for (var i = 0; i < children.length; i++) {
            //console.log("before line")
            //console.log(this)
            if (children[i].children.length < 1) {
                //console.log("i have no children")
                this.children.push(children[i].findChildren(layout, numChildren))
            } else {
                this.children.push(children[i])
            }
            children[i].parents.push(this)
        }
        
        //console.log(this)
        return this  
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}