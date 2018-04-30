/** Class representing a Mahjong layout. */
class StudioLayout extends Layout{
    /**
     * Create a Layout
     * @param {context} state - The scene in which the layout resides.
     * @see TileNode
     */
    constructor (state) {
        super(state)
        this.size = 0
        this.height = 1
        this.uniqueTiles = 5
        this.maxDuplicates = 99
        this.layers = []
    }
    /**
     * Fills the bottom layer of the layout with unplaced StudioTileNodes
     * <p>
     * 'tile' is a preset asset for the tilenode face
     * @see StudioTileNode
     */
    fillBottomLayer() {
        var session = gameSession
        var layer = []
        for (var i = 0; i < session.layoutY; i++) {
            layer.push([])
            for (var j = 0; j < session.layoutX; j++) {
                layer[i].push(new StudioTileNode(this.state, j, i, 1, this.numChildren))
                layer[i][j].setTile('tile')
            }
        }
        this.layers.push(layer)  
    }
    /**
     * adds a new layer filled with nulls to the layout
     * <p>
     * This is done to make room for the layout to grow upwards when a 
     * tile is placed at the top layer
     */
    addNullLayer() {
        var s = gameSession
        var x = s.layoutX
        var y = s.layoutY
        switch (this.numChildren) {
            case 1:
                break
            case 2:
                x -= this.height
                break
            case 4:
                x -= this.height
                y -= this.height
                break
        }
        if (x === 0 || y === 0) {
            return false
        }
        var layer = []
        for (var i = 0; i < y; i++) {
            layer.push([])
            for (var j = 0; j < x; j++) {
                layer[i].push(null)
            }
        }
        this.layers.push(layer)
        this.height++
        return true
    }
    /**
     * adds all necessary StudioTileNodes to the layout given the addition of a tilenode
     * <p>
     * Firstly we check the number of children and operate accordingly
     * 1 Child:
     *    Add a new unplaced Tilenode directly on top of the given StudioTileNode
     * 2 children:
     *    Check the StudioTileNodes to the left and right of the given StudioTileNode
     *    if a neighbour StudioTileNode is placed add a new unplaced StudioTileNode on top 
     *    and between the given StudioTileNode and the placed neighbour
     * 4 children:
     *    Firstly find the tilenodes in all cardinal directions. If a StudioTileNode is not 
     *    present either because its out of the index or is presently null set to null
     *    There are four possible orientations that a new tile may be placed. 
     *    (W,NW,N), (N,NE,E), (E,SE,S), (S,SW,W)
     *    If all tiles in these cases are placed then add a new unplaced tilenode as a parent 
     *    on top and between these and the given StudioTileNode
     *    
     */
    addTileNode(tilenode) {
        var x = tilenode.x
        var y = tilenode.y
        var z = tilenode.z
        if (tilenode.height === this.height) {
            if (!this.addNullLayer()) {
                this.size++
                return
            }
        }
        switch(this.numChildren) {
            case 1:
                this.layers[z+1][y][x] = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                this.layers[z+1][y][x].setTile('tile')
                tilenode.parents.push(this.layers[z+1][y][x])
                this.layers[z+1][y][x].children.push(tilenode)
                this.layers[z+1][y][x].setSpritePosition(this.numChildren)
                break
            case 2:
                if (x-1 >= 0) {
                    var left = this.layers[z][y][x-1]
                    if (left !== null && left.placed) {
                        var tile = new StudioTileNode(this.state, x-1, y, z+2, this.numChildren)
                        this.layers[z+1][y][x-1] = tile
                        tile.setTile('tile')
                        tilenode.parents.push(tile)
                        left.parents.push(tile)
                        tile.children.push(tilenode)
                        tile.children.push(left)
                        tile.setSpritePosition(this.numChildren)
                    }
                }
                if (x+1 < this.layers[z][y].length) {
                    var right = this.layers[z][y][x+1]
                    if (right !== null && right.placed) {
                        var tile = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                        this.layers[z+1][y][x] = tile
                        tile.setTile('tile')
                        tilenode.parents.push(tile)
                        right.parents.push(tile)
                        tile.children.push(tilenode)
                        tile.children.push(right)
                        tile.setSpritePosition(this.numChildren)
                    }
                }
                break
            case 4:
                //avoid out of index error
                //Collect StudioTileNodes in all cardinal directions
                if (x-1 < 0) {
                    var w = null
                    var nw = null
                    var sw = null
                } else {
                    var w = this.layers[z][y][x-1]
                }
                if (x+1 >= this.layers[z][0].length) {
                    var e = null
                    var ne = null
                    var se = null
                } else {
                    var e = this.layers[z][y][x+1]
                }
                if (y-1 < 0) {
                    var n = null
                    var nw = null
                    var ne = null
                } else {
                    var n = this.layers[z][y-1][x]
                    if (w) {
                        var nw = this.layers[z][y-1][x-1]
                    }
                    if (e) {
                        var ne = this.layers[z][y-1][x+1]
                    }
                }
                if (y+1 >= this.layers[z].length) {
                    var s = null
                    var sw = null
                    var se = null
                } else {
                    var s = this.layers[z][y+1][x]
                    if (w) {
                        var sw = this.layers[z][y+1][x-1]
                    }
                    if (e) {
                        var se = this.layers[z][y+1][x+1]
                    }
                }
                //Check if a new StudioTileNode can be placed
                //top left
                if ((w && nw && n) && (w.placed && nw.placed && n.placed)) {
                    var tile = new StudioTileNode(this.state, x-1, y-1, z+2, this.numChildren)
                    this.layers[z+1][y-1][x-1] = tile
                    tile.setTile('tile')
                    tilenode.parents.push(tile)
                    w.parents.push(tile)
                    nw.parents.push(tile)
                    n.parents.push(tile)
                    tile.children.push(tilenode)
                    tile.children.push(w)
                    tile.children.push(nw)
                    tile.children.push(n)
                    tile.setSpritePosition(this.numChildren)
                }
                //top right
                if ((n && ne && e) && (n.placed && ne.placed && e.placed)) {
                    var tile = new StudioTileNode(this.state, x, y-1, z+2, this.numChildren)
                    this.layers[z+1][y-1][x] = tile
                    tile.setTile('tile')
                    tilenode.parents.push(tile)
                    n.parents.push(tile)
                    ne.parents.push(tile)
                    e.parents.push(tile)
                    tile.children.push(tilenode)
                    tile.children.push(n)
                    tile.children.push(ne)
                    tile.children.push(e)
                    tile.setSpritePosition(this.numChildren)
                }
                //bottom left
                if ((w && sw && s) && (w.placed && sw.placed && s.placed)) {
                    var tile = new StudioTileNode(this.state, x-1, y, z+2, this.numChildren)
                    this.layers[z+1][y][x-1] = tile
                    tile.setTile('tile')
                    tilenode.parents.push(tile)
                    w.parents.push(tile)
                    sw.parents.push(tile)
                    s.parents.push(tile)
                    tile.children.push(tilenode)
                    tile.children.push(w)
                    tile.children.push(sw)
                    tile.children.push(s)
                    tile.setSpritePosition(this.numChildren)
                }
                //bottom right
                if ((s && se && e) && (s.placed && se.placed && e.placed)) {
                    var tile = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                    this.layers[z+1][y][x] = tile
                    tile.setTile('tile')
                    tilenode.parents.push(tile)
                    s.parents.push(tile)
                    se.parents.push(tile)
                    e.parents.push(tile)
                    tile.children.push(tilenode)
                    tile.children.push(s)
                    tile.children.push(se)
                    tile.children.push(e)
                    tile.setSpritePosition(this.numChildren)
                }
                break
        }
        this.size++
    }
    /**
     * Removes a StudioTileNode from the layout
     * <p>
     * This can occur in 3 cases. 
     * - If a tilenode with parents was selected do nothing
     * - If a tilenode that is placed is selected unplace it
     * - If an unplaced tilenode was selected remove it and 
     *   unplace its children unless it is on the bottom layer 
     */
    removeStudioNode (tilenode) {
        if (tilenode.parents.length > 0) {
            return
        }
        if (tilenode.placed) {
            this.size--
            tilenode.placed = false
            tilenode.tile.setAlpha(0.6)
            tilenode.dimTile()
        } else {
            if (tilenode.height === 1) {
                return
            }
            for (var i = 0; i < tilenode.children.length; i++) {
                tilenode.children[i].removeParent(tilenode)
                if ( tilenode.children[i].parents.length === 0) {
                    this.removeStudioNode(tilenode.children[i]) 
                    tilenode.children.splice(i--,1)
                }
            }
            if (tilenode.children.length < this.numChildren) {
                tilenode.tile.destroy()
                this.layers[tilenode.z][tilenode.y][tilenode.x] = null 
            } else {
                for (var index in tilenode.children) {
                    tilenode.children[index].parents.push(tilenode)
                }
            }
        }
    }
    /**
     * Function to encode a layer into JSON 
     * <p>
     * encodes a 2 dimensional array of the layer with placed StudioTileNodes as
     * 1's and unplaced or null values as 0's
     * @param {number} height - The height of the layer to encode
     */
    getLayerAsJSON (height) {
        var z = height - 1
        var x = this.layers[z][0].length
        var y = this.layers[z].length
        var layer = Array(y).fill().map(() => Array(x).fill(0))
        var found = false
        for (var i = 0; i < this.layers[z].length; i++) {
            for (var j = 0; j < this.layers[z][i].length; j++) {
                if(this.layers[z][i][j] !== null && this.layers[z][i][j].placed) {
                    layer[i][j] = 1
                    found = true
                } 
            }
        }
        if(found) {
            return layer
        }
        return null
    }
    /**
     * Makes unplaced StudioTileNodes invisible/visible to the user
     * <p>
     * iterates through the layout making visible StudioTileNodes invisible 
     * and vice versa
     */
    toggleVisible () {
        var studioSession = new StudioSession()
        studioSession.visible = !studioSession.visible
        for (var i = 0; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].length; j++) {
                for (var k = 0; k < this.layers[i][j].length; k++) {
                    if (this.layers[i][j][k] !== null && !this.layers[i][j][k].placed) {
                        this.layers[i][j][k].tile.setVisible(studioSession.visible)
                    }
                }
            }
        }
    }
    
}