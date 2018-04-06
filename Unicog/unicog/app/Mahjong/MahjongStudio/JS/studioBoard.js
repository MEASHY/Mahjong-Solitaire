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
        //this.layout.layers = new Array(session.layoutX,session.layoutY);
        this.layout.fillBottomLayer()
        console.log(this)
        
        this.size = scene.add.text(50, 300, 'Size: 0', { fontFamily: 'Arial', fontSize: 24, color: '#ffff00' });
        
    }
    placeTile(tilenode){
        tilenode.tile.setAlpha(1)
        tilenode.unhighlightTile()
        tilenode.placed = true
        this.layout.addTileNode(tilenode)
        this.size.setText('Size: ' + this.layout.size)
    }
    removeTile(tilenode){
        this.layout.removeStudioNode(tilenode)
        this.size.setText('Size: ' + this.layout.size)
    }
}
