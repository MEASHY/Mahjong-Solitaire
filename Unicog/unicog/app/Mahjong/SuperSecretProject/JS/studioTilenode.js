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
    
    
}
    
    
