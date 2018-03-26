/** Class representing a Mahjong layout. */
class Layout {
    /**
     * Create a Layout
     * @param {context} state - The scene in which the layout resides.
     * @see TileNode
     */
    constructor (state) {
        this.state = state
        this.size = gameSession.layout.header.size
        this.height = gameSession.layout.header.height
        this.uniqueTiles = gameSession.layout.header.uniqueTiles
        this.maxDuplicates = gameSession.layout.header.maxDuplicates
        this.numChildren = gameSession.layout.header.numChildren
        this.layers = []
        this.roots = []
    }
    /**
     * Adds a layer to the layers array.
     * <p>
     * Given a json array of 1's and 0's populate an array of TileNodes where the 1's are.
     * @param {array} layer   - json array indicating the position of TileNodes
     * @param {number} height - The height of the layer
     * @see TileNode
     */
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
    /**
     * Creates the hierarchy between the TileNodes.
     * <p>
     * The Layout class stores the TileNodes in a 3-dimensional array however,
     * the TileNodes have an inherit tree structure that joins them. This function 
     * initializes that structure    
     */
    buildHierarchy () {
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
    /**
     * Finds the TileNodes neighbouring a given TileNode
     * <p>
     * If the findEmpty flag is set to true then we find uninitialized TileNodes.
     * This is useful when generating initial Layout generation.
     * @param {TileNode} tile     - The TileNode we are finding the neighbours of.
     * @param {boolean} findEmpty - a flag determining if we are finding uninitialized neighbours.
     * @return {TileNode[]} neighbours - An array of the neighbours of this TileNode
     */
    findNeighbours (tile, findEmpty = false) {
        if (tile == null) {return []}
        var neighbours = []
        //look for neighbours on the left
        for (var i = tile.x - 1; i >= 0; i--) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (findEmpty && this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                   neighbours.push(this.layers[tile.z][tile.y][i]) 
                   break
               }
            }
        }
        //look for neighbours on the right
        for (var i = tile.x + 1; i < this.layers[tile.z][tile.y].length; i++) {
            if (this.layers[tile.z][tile.y][i] != null) {
               if (findEmpty && this.layers[tile.z][tile.y][i].isSet()) {
                   break
               } else {
                    neighbours.push(this.layers[tile.z][tile.y][i])
                    break
               }
            }
        }
        return neighbours
    }
    /**
     * Removes a TileNode from layers
     * <p>
     * When a TileNode is removed from layers we must update the roots array.
     * The children of removed TileNodes should be added to the root if they have no parents.
     * These children should also be made selectable if applicable.
     * @param {TileNode} tilenode - The TileNode we are removing.
     */
    removeTile (tilenode) {
        //remove from root
        for (var i = 0; i < this.roots.length; i++) {
            if (this.roots[i] === tilenode) {
                this.roots.splice(i, 1)
            }
        } 
        //add children to root and make selectable if applicable
        for (var i = 0; i < tilenode.children.length; i++) {
            tilenode.children[i].removeParent(tilenode)
            if (tilenode.children[i].parents.length === 0) {
                this.roots.push(tilenode.children[i])
                if (this.findNeighbours(tilenode.children[i]).length < 2) {
                    tilenode.children[i].selectable = true
                    if (gameSession.beginnerMode) {
                        tilenode.children[i].unhighlightTile()
                    }
                }
            }
        }
        //set the adjacent tilenode to be selectable
        var neighbours = this.findNeighbours(tilenode)
        if (neighbours.length > 0 && neighbours[0].parents.length === 0) {
            neighbours[0].selectable = true
            if (gameSession.beginnerMode) {
                neighbours[0].unhighlightTile()
            }
            
        }
        tilenode.tile.destroy()
        this.layers[tilenode.z][tilenode.y][tilenode.x] = null
    }
    /**
     * Generates a solvable layout of Mahjong tiles
     * <p>
     * A complete overview of the algorithm available here: 
     * {@link https://github.com/MEASHY/Mahjong-Solitaire/wiki/Mahjong-Algorithm} 
     * @param {array} counts - An array of how many tiles from possible are left to place.
     * @param {array} possible - An array of possible tiles sprites to place.
     */
    generateTiles (counts = null, possible = null) {
        var session = new GameSession()
        var originalCounts = []
        var originalPossible = []
        if (counts == null) {
            var counts = new Array(Math.min(this.uniqueTiles, gameSession.tileset.size)).fill(this.maxDuplicates)
        }
        if (possible == null) {
            var possible = []
            while(possible.length < this.uniqueTiles){
                var randomnumber = Math.floor(Math.random() * gameSession.tileset.size);
                if(possible.indexOf(randomnumber) > -1) continue;
                if(randomnumber  < 10) {
                    randomnumber = "0" + randomnumber.toString()
                }
                possible[possible.length] = randomnumber;
            }
        }
         
        for (var i = 0; i < counts.length; i++) {
            originalCounts.push(counts[i])
            originalPossible.push(possible[i])
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
                for (var i = lowerTiles.length - 1; i >= 0; i--) {
                    if (lowerTiles[i].height === this.height) {
                        upperTiles.push(lowerTiles.splice(i, 1)[0])
                    } 
                }
            }
            var numLower = 0
            for (var index in lowerTiles) {
                numLower += lowerTiles[index].height
            }
            
            if (lowerTiles.length <= 2 || numLower <= upperTiles[0].height) {
                var randPos1 = Math.floor(Math.random() * Math.floor(upperTiles.length))
                var pos1 = upperTiles.splice(randPos1, 1)[0]
            } else {
                var randPos1 = Math.floor(Math.random() * Math.floor(upperTiles.length + lowerTiles.length))
                if (randPos1 > upperTiles.length - 1) {
                    var pos1 = lowerTiles.splice(randPos1 - upperTiles.length, 1)[0]
                } else {
                    var pos1 = upperTiles.splice(randPos1, 1)[0]
                }
            }
            
            var randPos2 = Math.floor(Math.random() * Math.floor(upperTiles.length + lowerTiles.length))
            if (randPos2 > upperTiles.length - 1) {
                var pos2 = lowerTiles.splice(randPos2 - upperTiles.length, 1)[0]
            } else {
                var pos2 = upperTiles.splice(randPos2, 1)[0]
            }
            
            try {
                pos1.setTile("tile"+possible[randTile])
                pos2.setTile("tile"+possible[randTile])
            }
            catch (err) {
                //melt the layout here
                this.clearTiles()
                this.meltLayout()
                this.generateTiles(originalCounts, originalPossible)
                return
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
        }
    }
    /**
     * rearranges the tilenodes into a solvable formation.
     * <p>
     * High layer tilenodes will be moved down to lower layers until the layout becomes solvable
     * This function should only apply to 1 children layouts
     * @param {array} array - An array of TileNodes that can be initializedin the next iteration
     * @param {array} newObjects - An array TileNodes we may be adding to the array
     */
    meltLayout () {
        if(this.numChildren > 1) {
            alert("The layout provided is unsolvable")
            return
        }
        for (var i = 0; i < this.roots.length;  i++) {
            if (this.roots[i].height === this.height) {
                var tilenode = this.roots.splice(i, 1)[0]
                tilenode.children[0].removeParent(tilenode)
                this.roots.push(tilenode.children[0])
                this.layers[tilenode.z][tilenode.y][tilenode.x] = null
                if(this.roots.length > 3) {
                    var randIndex
                    do {
                        randIndex = Math.floor(Math.random() * this.roots.length)
                    } while (this.roots[randIndex].height >= this.height - 1)
                    var lowTile = this.roots.splice(randIndex,1)[0]
                    var newTile = new TileNode(this.state, lowTile.x, lowTile.y, lowTile.height+1, this.numChildren)
                    newTile.children.push(lowTile)
                    lowTile.parents.push(newTile)
                    this.roots.push(newTile)
                    this.layers[newTile.z][newTile.y][newTile.x] = newTile
                } else {
                    do {
                        var randX = Math.floor(Math.random() * 3) + (tilenode.x - 1) 
                        var randY = Math.floor(Math.random() * 3) + (tilenode.y - 1) 
                    } while ((randX === tilenode.x && randY === tilenode.y) ||
                             randX < 0 || randY < 0 ||
                             randX >= this.layers[0][0].length || 
                             randY >= this.layers[0].length ||
                             this.layers[0][randY][randX] != null
                            )
                    var newTile = new TileNode(this.state, randX, randY, 1, this.numChildren)
                    
                    this.layers[0][randY][randX] = newTile
                    this.roots.push(newTile)
                }
                i = 0
            }
        }
        this.height--
    }
    
    /**
     * adds TileNodes to an array.
     * <p>
     * In order to be added the TileNode must not be a duplicate and must be 
     * selectable in the currently generated layout
     * @param {array} array - An array of TileNodes that can be initializedin the next iteration
     * @param {array} newObjects - An array TileNodes we may be adding to the array
     */
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
    /**
     * Repositions every Sprite in the layout
     * <p>
     * traverses the layout linearly reseting the position of each TileNode
     *
     * @see TileNode
     */
    positionSprites() {
        var s = gameSession
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
    /**
     * Dims all non selectable tiles
     */
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
    /**
     * Highlights two tiles that would create a valid match
     * <p>
     * traverses the layout linearly to find two matching tiles
     */
    giveHint() {
        var nodeList = []
        
        for (var i = 0; i < this.roots.length; i++) {
            
            if (!this.roots[i].selectable) {
                continue
            }
            
            for (var j = 0; j < nodeList.length; j++) {
                if (nodeList[j].tile.texture.key === this.roots[i].tile.texture.key) {
                    console.log("Found match")
                    nodeList[j].highlightTile(0x5c95f2)
                    this.roots[i].highlightTile(0x5c95f2)
                    return
                } 
            }
            nodeList.push(this.roots[i])
        }
    }
    /**
     * Checks if there is a valid match on the board
     */
    validMatchAvailable () {
        var textureList = []
        
        for (var i = 0; i < this.roots.length; i++) {
            if (!this.roots[i].selectable) {
                continue
            }
            if (textureList.indexOf(this.roots[i].tile.texture.key) > -1 ) {
                return true
            } else {
                textureList.push(this.roots[i].tile.texture.key)
            }
        }
        return false
    }
    /**
     * Shuffles the remaining tiles on the board so that the layout becomes solvable again
     * <p>
     * This generates a counts and possible array which are passed back to generateTiles 
     * While this happens we destroy all sprites currently on the board
     * @see Layout.generateTiles({array} counts, {array} possible) 
     */
    shuffle () {
        // Number of times you can have a tile and type of tile
        var counts = []
        var possible = []
        // Go through every tile on the board
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if(this.layers[i][j][k] !== null) {
                        if(this.layers[i][j][k].height > this.height) {
                            this.height = this.layers[i][j][k].height
                        }
                        // Takes what textures are currently on the board 
                        var temp = this.layers[i][j][k].tile.texture.key.slice(-2)
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
        
        for (var i = 0; i < counts.length; i++) {
            counts[i] /= 2
        }
        
        this.generateTiles(counts, possible)
        this.positionSprites()
        var s = new GameSession()
        if (s.beginnerMode) {
            this.initializeBeginnerMode()
            console.log("starting beginner mode")
        }
    }
    
    clearTiles () {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if(this.layers[i][j][k] !== null) {
                        if(this.layers[i][j][k].height > this.height) {
                            this.height = this.layers[i][j][k].height
                        }       
                        // Destroys the tile if set
                        if (this.layers[i][j][k].isSet()) {
                            this.layers[i][j][k].tile.destroy()
                            this.layers[i][j][k].tile = null
                        }
                    }
                }
            }
        }
    }
}
