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
    
    //add a single layer to the layout 
    addJsonLayer(layer, height) {
        var generated = []
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
    
    //constructs the tree structure between tileNodes within the layers array 
    buildHierarchy() {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if (this.layers[i][j][k] == null) {
                        continue
                    }
                    if (this.layers[i][j][k].parents.length < 1){
                        this.roots.push(this.layers[i][j][k].findChildren(this, this.numChildren))
                    }
                }
            }
        }
        console.log("roots")
        console.log(this.roots)
    }
    
    findNeighbors(tile, findEmpty = false) {
        if (tile == null) {return false}
        var neighbors = []
        for (var i = tile.x - 1; i > 0; i--) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (findEmpty && this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                   neighbors.push(this.layers[tile.z][tile.y][i]) 
                   break
               }
            }
        }
        for (var i = tile.x + 1; i < this.layers[tile.z][tile.y].length - 1; i++) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (findEmpty && this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                    neighbors.push(this.layers[tile.z][tile.y][i])
                    break
               }
            }
        }
        return neighbors
    }
    
    removeTile(tile) {
        //remove from root
        for (var i = 0; i < this.roots.length; i++) {
            if (this.roots[i] === tile) {
                this.roots.splice(i, 1)
            }
        } 
        //add children to root and make selectable if applicable
        for (var i = 0; i < tile.children.length; i++) {
            this.roots.push(tile.children[i])
            if (this.findNeighbors(tile.children[i]).length < 2) {
                tile.children[i].selectable = true
            }
        }
        //set the adjacent tile to be selectable
        this.findNeighbors(tile)[0].selectable = true
        tile = null
    }
    
    generateTiles() {
        var session = new GameSession()
        var counts = new Array(Math.min(this.uniqueTiles, session.tileSetSize)).fill(0)
        var possible = [...Array(counts.length).keys()]
        console.log(counts)
        console.log(possible)
        var upperTiles = []
        var lowerTiles = []
        
        for (var i = 0; i < this.roots.length; i++) {
            if (this.findNeighbors(this.roots[i], true) < 2) {
                this.roots[i].selectable = true
                if (this.roots[i].height === this.height) {
                    upperTiles.push(this.roots[i])
                } else {
                    lowerTiles.push(this.roots[i])
                }
            }
        }
        
        for (var n = 0; n < this.size/2; n++) {
            //get tile
            var randTile = Math.floor(Math.random() * Math.floor(possible.length))
            
            if (upperTiles.length < 1) {
                this.height--
                var temporaryArray = []
                for (var i = lowerTiles.length - 1; i >= 0; i--) {
                    console.log("---------------------")
                    console.log(lowerTiles[i])
                    console.log(lowerTiles[i].height)
                    console.log(this.height)
                    if (lowerTiles[i].height === this.height) {
                        console.log("accepted")
                        console.log(lowerTiles[i])
                        upperTiles.push(lowerTiles.splice(i, 1)[0])
                    } else {
                        console.log("rejected")
                        lowerTiles[i]
                    }
                    
                    console.log("---------------------")
                }
                
            }
                
            
            if (lowerTiles.length < 3) {
                var randPos1 = Math.floor(Math.random() * Math.floor(upperTiles.length))
                var pos1 = upperTiles.splice(randPos1, 1)[0]
            } else {
                
                // May need a +1 if we die
                var randPos1 = Math.floor(Math.random() * Math.floor(upperTiles.length + lowerTiles.length))
                if (randPos1 > upperTiles.length - 1) {
                    var pos1 = lowerTiles.splice(randPos1 - upperTiles.length, 1)[0]
                } else {
                    var pos1 = upperTiles.splice(randPos1, 1)[0]
                }
            }
            
            // May need a +1 if we die
            var randPos2 = Math.floor(Math.random() * Math.floor(upperTiles.length + lowerTiles.length))
            if (randPos2 > upperTiles.length - 1) {
                var pos2 = lowerTiles.splice(randPos2 - upperTiles.length, 1)[0]
            } else {
                var pos2 = upperTiles.splice(randPos2, 1)[0]
            }
            
            
            
            //assign the tile to the two selected positions
            pos1.setTile("tile"+possible[randTile])
            pos2.setTile("tile"+possible[randTile])
            
            //if we have placed as many pairs of this tile as possible remove from list
            if (++counts[possible[randTile]] == this.maxDuplicates) {
                possible.splice(randTile, 1)
            }
            
            //console.log(counts)
            //console.log(randTile, randPos1, randPos2)
            console.log(n)
            console.log("tile"+possible[randTile])
            console.log(pos1)
            console.log(pos2)
            //console.log("Pos-----------------")
            
            var childrenToPush = []
            
            
            //find the new child positions opened by the assignment of position 1
            for (var i = 0; i < pos1.children.length; i++){
                if (pos1.children[i].allParentsGenerated() && this.findNeighbors(pos1.children[i], true).length < 2){
                    childrenToPush.push(pos1.children[i])
                }
            }           
            
            //find the new child positions opened by the assignment of position 2
            for (var i = 0; i < pos2.children.length; i++){
                if (pos2.children[i].allParentsGenerated() && this.findNeighbors(pos2.children[i], true).length < 2){
                    childrenToPush.push(pos2.children[i])
                }
            }
            
            if (pos1.height === this.height) {
                this.mergeArrays(upperTiles, this.findNeighbors(pos1, true))   
            } else {
                this.mergeArrays(lowerTiles, this.findNeighbors(pos1, true))
            }
            if (pos2.height === this.height) {
                this.mergeArrays(upperTiles, this.findNeighbors(pos2, true))   
            } else {
                this.mergeArrays(lowerTiles, this.findNeighbors(pos2, true))
            }
            
            
            this.mergeArrays(lowerTiles, childrenToPush)
            
            console.log(counts)
            console.log(possible)
        }
    }
    
    mergeArrays(array, newObjects) {
        for (var i = 0; i < newObjects.length; i++) {
            var invalidTile = false
            //Check all children are generated for the tile
            if (!newObjects[i].allParentsGenerated()) {
                invalidTile = true
            } else {
                //Ensure a duplicate is not pushed into open tiles
                for (var j = 0; j < array.length; j++){
                    if (newObjects[i] === array[j]) {
                        invalidTile = true
                        break
                    }
                }
            }
            // Good to go - push it
            if (!invalidTile) {
                array.push(newObjects[i])
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
        for (var i = 0; i < layer.length; i++) {
            for (var j = 0; j < layer[i].length; j++) {
                if (layer[i][j] != null) {
                    layer[i][j].setTile("tile0")
                }
            }
        }
    }
}



class TileNode {
    constructor(state, x, y, height){
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
        this.tile = null,
        this.selectable = false
    }
    
    highlightTile() {  
        this.tile.setTint(0xff0000)
    }
    
    unhighlightTile() {
        this.tile.clearTint()
    }

    
    setTile(img) {
        this.tile = this.state.add.sprite(this.xPos, this.yPos, img).setInteractive()
        this.tile.setDepth(this.height*1000 + this.y)
        var self = this;
        this.tile.on('pointerdown', function () {  
            self.state.board.selectTile(self)
        });
    }
    
    isSet() {
        if (this.tile == null) {
            return false
        }
        return true
    }
    
    //Checks if the Tiles for all the child nodes are set
    allChildrenGenerated() {
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].isSet()){
                console.log(this.children[i])
                return false
            }            
        }
        return true
    }
    
    //Checks if the Tiles for all the parent nodes are set
    allParentsGenerated() {
        for (var i = 0; i < this.parents.length; i++) {
            if (!this.parents[i].isSet()){
                console.log(this.parents[i])
                return false
            }            
        }
        return true
    }
    
    findChildren(layout, numChildren) {
        if (this.height == 1){
            return this
        }
        
        //get the children for the current position
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
        
        for (var i = 0; i < children.length; i++) {
            //If the child hasn't already already been looked at and isn't a leaf recursively call findChildren 
            if (children[i].children.length < 1 && children[i].height > 1) {
                this.children.push(children[i].findChildren(layout, numChildren))
            } else {
                this.children.push(children[i])
            }
            children[i].parents.push(this)
        }
        
        return this  
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}