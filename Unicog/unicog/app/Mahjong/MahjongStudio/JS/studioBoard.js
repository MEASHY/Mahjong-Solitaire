/** Class representing a Mahjong board. */
class StudioBoard {
    /**
     * Create a Board 
     * <p>
     * The Board is initialized by generating a fresh layout and filling
     * the bottom layer with placable tiles
     * @param {context} scene - The scene in which the sprite resides.
     */
    constructor (scene) { 
        this.scene = scene
        
        this.layout = new StudioLayout(this.scene)
        this.layout.fillBottomLayer()
    }
    /**
     * Places a given tilenode and adds a placable parent if applicable 
     * <p>
     * Sets the passed tilenode to be opaque removing the dimming effect
     * The layout is then passed the tilenode to determine if a new parent needs to be added
     * @param {TileNode} tilenode - The TileNode being placed
     */
    placeTile(tilenode){
        tilenode.tile.setAlpha(1)
        tilenode.unhighlightTile()
        tilenode.placed = true
        this.layout.addTileNode(tilenode)
        this.scene.buttons.sizeText.sprite.setText('Size: ' + this.layout.size)
    }
    /**
     * Removes a tilenode
     * <p>
     * passes the tilenode to layout to determine how to modify the layout
     * @param {TileNode} tilenode - The TileNode being removed
     */
    removeTile(tilenode){
        this.layout.removeStudioNode(tilenode)
        this.scene.buttons.sizeText.sprite.setText('Size: ' + this.layout.size)
    }
}
