/** Class representing a Mahjong tile position. 
 * @extends TileNode
*/
class StudioTileNode extends TileNode{
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
        super(state, x, y, height, numChildren)
        this.placed = false
    }
    /**
     * Initializes a sprite with a given image for this tile at the origin.
     * The img argument must specify a preloaded Phaser Sprite
     * <p>
     * The StudioTileNode is immediately dimmed and alpha is set to 60%
     *
     * @param {string} img - A string denoting a preloaded Phaser Sprite
     * @see StudioTileNode
     */
    setTile(img) {
        this.tile = this.state.add.sprite(0, 0, img).setInteractive()
        // Assures each tile has a unique depth per layout
        this.tile.setDepth(this.height*1000000 + this.y*1000 + this.x)
        this.tile.setAlpha(0.6)
        this.dimTile()
        var self = this;
        this.tile.on('pointerdown', function (pointer,tilenode) {  
            if (pointer.buttons === 1) {
                if (!self.placed) {
                    self.state.board.placeTile(self)
                }
                
            }
            else if (pointer.buttons === 2) {
                self.state.board.removeTile(self)
            }
        })
    }
    /**
     * Sets the sprite position of the TileNode to be centered on the screen in the correct layout position.
     * The sprite is also scaled to the session scale parameter 
     * <p>
     * Tile position is determined by the size of the tile and its position in the layout
     * after determining its base position the position is further offset to be centered on its children
     *
     * @param {number} numChildren - The number of children a given TileNode has
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
            yPos += ((s.tileset.tileY - s.tileset.tileFaceY) * s.scale)
        }
        
        // Adjusts tile to the center of its children
        yPos -= ((s.tileset.tileY - s.tileset.tileFaceY) * s.scale) * this.z
        xPos -= ((s.tileset.tileX - s.tileset.tileFaceX) * s.scale) * this.z
        
        this.tile.setPosition(xPos,yPos)
        this.tile.setScale(scale)
    }
    
    
}
    
    
