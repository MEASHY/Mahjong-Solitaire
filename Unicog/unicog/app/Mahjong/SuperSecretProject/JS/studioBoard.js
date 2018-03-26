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
        //replace with correct structure
        //x,y should be known
        //for (var i = 1; i <= this.layout.height; i++) {
        //    this.layout.addJsonLayer(session.layout['layer'+i], i)
        //}
        //session.sizeX = this.layout.layers[0][0].length
        //session.sizeY = this.layout.layers[0].length
        
        //this.layout.buildHierarchy()
        //this.layout.generateTiles() 
        //create this
        
    }
    placeTile(tilenode){
        tilenode.tile.setAlpha(1)
        tilenode.unhighlightTile()
        tilenode.placed = true
        this.layout.addTileNode(tilenode)
    }
    removeTile(tilenode){
        this.layout.removeStudioNode(tilenode)
    }
}
