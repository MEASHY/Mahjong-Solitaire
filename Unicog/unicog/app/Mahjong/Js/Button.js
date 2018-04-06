/** Class representing a UI button. */
class Button {
    /**
     * Create a Button
     * @param {context} state     - The scene in which the sprite resides.
     * @param {number} x          - The % position of the Button on the x axis.
     * @param {number} y          - The % position of the Button on the y axis.
     * @param {number} depth      - The depth of ui elements.
     * @param {boolean} visible   - Whether the button is visible.
     * @see Layout
     */
    constructor(state, x, y, depth=0, visible=false){
        this.state = state,
        this.x = Math.max(0,Math.floor(x,100)),
        this.y = Math.max(0,Math.floor(y,100)),
        this.depth = 20000000001 + depth,
        this.sprite = null,
        this.visible = visible
    }
    
    toggleVisibility() {
        this.visible = !this.visible
        this.sprite.setVisible(this.visible)
    }
    /**
     * Sets the sprite position of the Button to be placed in a relative position on the screen
     * <p>
     * Button position is determined by the size window and the x/y percent given at construction
     */
    setSpritePosition() {
        var xPos = game.config.width * (this.x/100)
        var yPos = game.config.height * (this.y/100)
        
        this.sprite.setPosition(xPos,yPos)
        this.sprite.setScale(gameSession.scale)
    }
    
    /**
     * Initializes a sprite with a given image for this Button at the origin.
     * The img argument must specify a preloaded Phaser Sprite
     * <p>
     * We set the depth of the Button to be greater than anything else on the screen
     *
     * @param {string} img - A string denoting a preloaded Phaser Sprite
     */
    setSprite(img) {
        this.sprite = this.state.add.sprite(0, 0, img).setInteractive()
        // Assures each tile has a unique depth per layout
        this.sprite.setDepth(this.depth)
        this.sprite.setVisible(this.visible)
        console.log("sprite set")
        this.setSpritePosition()
    }
    
    fillScreen() {
        this.sprite.setOrigin(0,0)
        this.sprite.setPosition(0,0)
        this.sprite.setScale(game.config.width/100)
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}