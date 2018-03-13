class Layout {
    constructor (state) {
        var session = new GameSession()
        
        this.state = state
        this.size = session.layout.header.size
        this.height = session.layout.header.height
        this.uniqueTiles = session.layout.header.uniqueTiles
        this.maxDuplicates = session.layout.header.maxDuplicates
        this.numChildren = session.layout.header.numChildren
        this.layers = []
        this.roots = []
    }
    
    //add a single layer to the layout 
    addJsonLayer (layer, height) {
        var generated = []
        for (var i = 0; i < layer.length; i++) {
            var row = []
            for (var j = 0; j < layer[i].length; j++) {
                if (layer[i][j] == 1) {
                    row.push(new TileNode(this.state, j, i, height, this.numChildren))
                } else {
                    row.push(null)
                }
            }
            generated.push(row)
        }
        this.layers.push(generated)
    }
    
    //constructs the tree structure between tileNodes within the layers array 
    buildHierarchy () {
        var session = new GameSession()
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if (this.layers[i][j][k] == null) {
                        continue
                    }
                    if (this.layers[i][j][k].parents.length < 1) {
                        this.roots.push(this.layers[i][j][k].findChildren(this, this.numChildren))
                    }
                }
            }
        }
    }
    
    findNeighbours (tile, findEmpty = false) {
        if (tile == null) {return false}
        var neighbors = []
        for (var i = tile.x - 1; i >= 0; i--) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (findEmpty && this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                   neighbors.push(this.layers[tile.z][tile.y][i]) 
                   break
               }
            }
        }
        for (var i = tile.x + 1; i < this.layers[tile.z][tile.y].length; i++) {
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
    
    removeTile (tile) {
        var session = new GameSession()
        //remove from root
        for (var i = 0; i < this.roots.length; i++) {
            if (this.roots[i] === tile) {
                this.roots.splice(i, 1)
            }
        } 
        //add children to root and make selectable if applicable
        for (var i = 0; i < tile.children.length; i++) {
            if (tile.children[i].parents.length < 2) {
                this.roots.push(tile.children[i])
                if (this.findNeighbours(tile.children[i]).length < 2) {
                    tile.children[i].selectable = true
                    if (session.beginnerMode) {
                        console.log("undimming")
                        tile.children[i].unhighlightTile()
                    }
                }
            }
            tile.children[i].removeParent(tile)
        }
        //set the adjacent tile to be selectable
        var neighbours = this.findNeighbours(tile)
        if (neighbours.length > 0 && neighbours[0].parents.length === 0) {
            neighbours[0].selectable = true
            if (session.beginnerMode) {
                console.log("undimming")
                neighbours[0].unhighlightTile()
            }
            
        }
        tile.tile.destroy()
        this.layers[tile.z][tile.y][tile.x] = null
    }
    
    generateTiles (counts = null, possible = null) {
        var session = new GameSession()
        
        if (counts == null) {
            var counts = new Array(Math.min(this.uniqueTiles, session.tileset.size)).fill(this.maxDuplicates)
        }
        if (possible == null) {
            var possible = [...Array(counts.length).keys()]
        }
        
        var upperTiles = []
        var lowerTiles = []
        
        for (var i = 0; i < this.roots.length; i++) {
            //console.log(this.findNeighbours(this.roots[i], true))
            if (this.findNeighbours(this.roots[i], true).length < 2) {
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
                    if (lowerTiles[i].height === this.height) {
                        upperTiles.push(lowerTiles.splice(i, 1)[0])
                    } else {
                        lowerTiles[i]
                    }
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
            
            try {
                //assign the tile to the two selected positions
                pos1.setTile("tile"+possible[randTile])
                pos2.setTile("tile"+possible[randTile])
       
            }
            catch (err) {
                console.log("critical failure!")
                console.log(counts)
                console.log(possible)
                console.log(upperTiles)
                console.log(lowerTiles)
                console.log(pos1)
                console.log(pos2)
                console.log(err)
                alert("This game is now unsolvable")
                throw("TypeError")
            }
                            
            //if we have placed as many pairs of this tile as possible remove from list
            if (--counts[randTile] == 0) {
                possible.splice(randTile, 1)
                counts.splice(randTile, 1)
            }
            
            var childrenToPush = []
            
            
            //find the new child positions opened by the assignment of position 1
            for (var i = 0; i < pos1.children.length; i++) {
                if (pos1.children[i].allParentsGenerated() && this.findNeighbours(pos1.children[i], true).length < 2) {
                    childrenToPush.push(pos1.children[i])
                }
            }           
            
            //find the new child positions opened by the assignment of position 2
            for (var i = 0; i < pos2.children.length; i++){
                if (pos2.children[i].allParentsGenerated() && this.findNeighbours(pos2.children[i], true).length < 2){
                    childrenToPush.push(pos2.children[i])
                }
            }
            
            if (pos1.height === this.height) {
                this.mergeArrays(upperTiles, this.findNeighbours(pos1, true))   
            } else {
                this.mergeArrays(lowerTiles, this.findNeighbours(pos1, true))
            }
            if (pos2.height === this.height) {
                this.mergeArrays(upperTiles, this.findNeighbours(pos2, true))   
            } else {
                this.mergeArrays(lowerTiles, this.findNeighbours(pos2, true))
            }
            
            
            this.mergeArrays(lowerTiles, childrenToPush)
            
            //console.log(counts)
            //console.log(possible)
        }
    }
    
    mergeArrays (array, newObjects) {
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
    
    setAll () {
        
        for (var i = 0; i < this.layers.length; i++) {
            this.setLayer(this.layers[i])
        }
    }
    
    setLayer (layer) {
        for (var i = 0; i < layer.length; i++) {
            for (var j = 0; j < layer[i].length; j++) {
                if (layer[i][j] != null) {
                    layer[i][j].setTile("tile0")
                }
            }
        }
    }
    /**
     * Repositions every Sprite in the layout
     * <p>
     * traverses the layout linearly reseting the position of each TileNode
     *
     * @see TileNode
     */
    positionSprites() {
        var s = new GameSession()
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if (this.layers[i][j][k] == null) {
                        continue
                    }
                    this.layers[i][j][k].setSpritePosition(s.layout.header.numChildren)
                }
            }
        }
    }
    
    initializeBeginnerMode () {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if(this.layers[i][j][k] !== null && !this.layers[i][j][k].selectable) {
                        this.layers[i][j][k].dimTile()
                    }                    
                }
            }
        }
    }
    
    // Checks that player can make at least one match
    // Used to see if a shuffle is needed
    validMatchAvailable () {
        var textureList = []
        
        for (var i = 0; i < this.roots.length; i++) {
            if (textureList.indexOf(this.roots[i].tile.texture.key) > -1) {
                
                return true
            } else {
                textureList.push(this.roots[i].tile.texture.key)
            }
        }
        return false
    }
    
    shuffle () {
        // Number of times you can have a tile and type of tile
        var counts = []
        var possible = []
        
        // Go through every tile on the board
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if(this.layers[i][j][k] !== null) {
                        
                        // Takes what textures are currently on the board 
                        var temp = parseInt(this.layers[i][j][k].tile.texture.key.slice(-1))
                        if (possible.indexOf(temp) > -1) {
                            counts[possible.indexOf(temp)] += 1
                        } else {
                            possible.push(temp)
                            counts.push(1)
                        }                 
                        // Destroys the tile 
                        this.layers[i][j][k].tile.destroy()
                        this.layers[i][j][k].tile = null
                    }                    
                }
            }
        }
        console.log("Counts")
        console.log(counts)
        console.log("Possible")
        console.log(possible)
        
        for (var i = 0; i < counts.length; i++) {
            counts[i] /= 2
        }
        
        this.generateTiles(counts, possible)
        this.positionSprites()
        
    }
}

class TileNode {
    constructor(state, x, y, height, numChildren){
        this.state = state,
        this.x = x,
        this.y = y,
        this.z = height-1,  
        this.height = height,
        this.parents = [], 
        this.children = [],
        this.tile = null,
        this.selectable = false
    }
    
    highlightTile (tint = 0xFFFD9A) {  
        this.tile.setTint(tint)
    }
    
    unhighlightTile () {
        this.tile.clearTint()
    }
    
    dimTile (dim = 0x808080) {
        this.tile.setTint(dim)
    }
    
    /**
     * Sets the sprite position of the TileNode to be cenetered on the screen in the correct layout position.
     * The sprite is also scaled to the session scale parameter 
     * <p>
     * Tile position is determined by the size of the tile and its position in the layout
     * after determining its base position the position is further offset to be centered on its children
     *
     * @param numChildren The number of children a given TileNode has
     * @see TileNode
     * @see Layout
     */
    setSpritePosition(numChildren) {
        var s = new GameSession()
        
        var xPos = s.tileset.tileFaceX * s.scale * this.x + s.offsetX
        var yPos = s.tileset.tileFaceY * s.scale * this.y + s.offsetY
        
        // For two and four children
        if (numChildren === 2) {
            xPos += (((s.tileset.tileFaceX * s.scale) / 2) * (this.z))
            //yPos += ((tileFaceY * scale) / 2) * (this.z)
        } else if (numChildren === 4) {
            xPos += ((s.tileset.tileFaceX * s.scale) / 2) * (this.z)
            yPos += ((s.tileset.tileFaceY * s.scale) / 2) * (this.z)
        } else if (numChildren === 1) {
            xPos += ((s.tileset.tileX - s.tileset.tileFaceX) * s.scale) 
                    * (s.layout.header.height / 2)
            yPos += ((s.tileset.tileY - s.tileset.tileFaceY) * s.scale) 
                    * (s.layout.header.height / 2)
        }
        
        // Adjusts tile to the center of its children
        yPos -= ((s.tileset.tileY - s.tileset.tileFaceY) * s.scale) * this.z
        xPos -= ((s.tileset.tileX - s.tileset.tileFaceX) * s.scale) * this.z
        
        this.tile.setPosition(xPos,yPos)
        this.tile.setScale(scale)
    }
    
    /**
     * Initializes a sprite with a given image for this tile at the origin.
     * The img argument must specify a preloaded Phaser Sprite
     * <p>
     * We set the depth of the tile based on its position in the layout array.
     * This ensures that each tile overlaps each other correctly
     * This method works for 999x999x999 tiles
     *
     * @param img A string denoting a preloaded Phaser Sprite
     * @see TileNode
     */
    setTile(img) {
        this.tile = this.state.add.sprite(0, 0, img).setInteractive()
        // Assures each tile has a unique depth per layout
        this.tile.setDepth(this.height*1000000 + this.y*1000 + this.x)
        var self = this;
        this.tile.on('pointerdown', function () {  
            self.state.board.selectTile(self)
        })
    }
    
    isSet () {
        if (this.tile == null) {
            return false
        }
        return true
    }
    
    removeParent (tileNode) {
        for( var i = 0; i < this.parents.length; i++) {
            if (tileNode === this.parents[i]) {
                this.parents.splice(i,1)
            }
        }
    }
    
    //Checks if the Tiles for all the child nodes are set
    allChildrenGenerated () {
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].isSet()){
                console.log(this.children[i])
                return false
            }            
        }
        return true
    }
    
    //Checks if the Tiles for all the parent nodes are set
    allParentsGenerated () {
        for (var i = 0; i < this.parents.length; i++) {
            if (!this.parents[i].isSet()){
                //console.log(this.parents[i])
                return false
            }            
        }
        return true
    }
    
    findChildren (layout, numChildren) {
        if (this.height == 1) {
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
