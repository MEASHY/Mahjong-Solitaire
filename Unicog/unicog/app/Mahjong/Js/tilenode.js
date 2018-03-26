/** Class representing a Mahjong tile position. */
class TileNode {
    /**
     * Create a TileNode
     * @param {context} state - The scene in which the sprite resides.
     * @param {number} x           - The x position of the TileNode in the Layout.
     * @param {number} y           - The y position of the TileNode in the Layout.
     * @param {number} height      - The height of the TileNode in the Layout.
     * @param {number} numChildren - The number of children this TileNode will have.
     * @see Layout
     */
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
    /**
     * Sets the sprite tint to a hexadecimal color. This color by default is off-yellow (0xFFFD9A)
     * but, can be set to any hexadecimal value.
     *
     * @param {number} tint - The hexadecimal value used to tint the sprite
     * @see Board.selectTile()
     */
    highlightTile (tint = 0xFFFD9A) {  
        this.tile.setTint(tint)
    }
    /**
     * removes the sprite tint. This will return the tint color to white.
     *
     * @see Board.selectTile()
     */
    unhighlightTile () {
        this.tile.clearTint()
    }
    /**
     * Sets the sprite tint to a hexadecimal color. This color by default is a grey (0x808080)
     * This method functions the same as highlightTile but defaults to a different color for clarity.
     *
     * @param {number} dim - The hexadecimal value used to tint the sprite
     * @see Layout.InitializeBeginnerMode()
     * @see TileNode.highlightTile(tint)
     */
    dimTile (dim = 0x808080) {
        this.tile.setTint(dim)
    }
    
    /**
     * Sets the sprite position of the TileNode to be centered on the screen in the correct layout position.
     * The sprite is also scaled to the session scale parameter 
     * <p>
     * Tile position is determined by the size of the tile and its position in the layout
     * after determining its base position the position is further offset to be centered on its children
     *
     * @param {number} numChildren - The number of children a given TileNode has
     * @see TileNode
     * @see Layout
     */
    setSpritePosition(numChildren) {
        var s = gameSession
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
     * @param {string} img - A string denoting a preloaded Phaser Sprite
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
    /**
     * Checks if the sprite contained in TileNode has been initialized 
     * @return {boolean} A boolean value 
     */
    isSet () {
        if (this.tile == null) {
            return false
        }
        return true
    }
    /**
     * removes a given TileNode from the parent array
     * @param {TileNode} tilenode - The TileNode to remove
     */
    removeParent (tileNode) {
        for( var i = 0; i < this.parents.length; i++) {
            if (tileNode === this.parents[i]) {
                this.parents.splice(i,1)
            }
        }
    }
    
    /**
     * Checks if all children have initialized sprites
     * @return {boolean} A boolean value 
     * @depreciated
     */
    allChildrenGenerated () {
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].isSet()){
                console.log(this.children[i])
                return false
            }            
        }
        return true
    }
    /**
     * Checks if all Parents have initialized sprites
     * @return {boolean} A boolean value 
     */
    allParentsGenerated () {
        for (var i = 0; i < this.parents.length; i++) {
            if (!this.parents[i].isSet()){
                //console.log(this.parents[i])
                return false
            }            
        }
        return true
    }
    /**
     * Finds the children of a TileNode and inserts them into the children array. As it finds the 
     * TileNode's children it also populates the parent array. 
     * <p>
     * This function also propagates down the children finding all the children recursively
     * When called on the layout roots this function will fill all children and the parents of the layout
     * @return {TileNode} The current TileNode  
     */
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