/** Class representing a Mahjong board. */
class StudioBoard {
    /**
     * Create a Board 
     * <p>
     * Also initializes a layout
     * @param {context} scene - The scene in which the sprite resides.
     * @see Layout
     */
    constructor (scene) { 
        this.scene = scene
        
        this.layout = new StudioLayout(this.scene)
        this.layout.fillBottomLayer()
    }
    placeTile(tilenode){
        tilenode.tile.setAlpha(1)
        tilenode.unhighlightTile()
        tilenode.placed = true
        this.layout.addTileNode(tilenode)
        this.scene.buttons.sizeText.sprite.setText('Size: ' + this.layout.size)
    }
    removeTile(tilenode){
        this.layout.removeStudioNode(tilenode)
        this.scene.buttons.sizeText.sprite.setText('Size: ' + this.layout.size)
    }
}
