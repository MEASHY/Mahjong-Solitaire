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
    
    fillBottomLayer() {
        var session = new gameSession
        console.log(session)
        var layer = []
        for (var i = 0; i < session.layoutY; i++) {
            console.log(i)
            layer.push([])
            for (var j = 0; j < session.layoutX; j++) {
                layer[i].push(new StudioTileNode(this.state, j, i, 1, this.numChildren))
                layer[i][j].setTile('tile01')
            }
        }
        this.layers.push(layer)  
        //this.positionSprites()
    }
    
    addNullLayer() {
        var s = new gameSession
        var x = s.layoutX
        var y = s.layoutY
        switch (this.numChildren) {
            case 1:
                break
            case 2:
                x - this.height
            case 4:
                x - this.height
                y - this.height
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
    
    addTileNode(tilenode) {
        var x = tilenode.x
        var y = tilenode.y
        var z = tilenode.z
        if (tilenode.height === this.height) {
            if (!this.addNullLayer()) {
                return
            }
        }
        switch(this.numChildren) {
            case 1:
                this.layers[z+1][x][y] = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                this.layers[z+1][x][y].setTile('tile01')
                tilenode.parents.push(this.layers[z+1][x][y])
                this.layers[z+1][x][y].children.push(tilenode)
                this.layers[z+1][x][y].setSpritePosition(this.numChildren)
                break
            case 2:
                if (x-1 >= 0) {
                    var left = this.layers[z][x-1][y]
                    if (left !== null && left.placed) {
                        var tile = new StudioTileNode(this.state, x-1, y, z+2, this.numChildren)
                        this.layers[z+1][x-1][y] = tile
                        tile.setTile('tile01')
                        tilenode.parents.push(tile)
                        left.parents.push(tile)
                        tile.children.push(tilenode)
                        tile.children.push(left)
                        tile.setSpritePosition(this.numChildren)
                    }
                }
                if (x+1 < this.layers[z][x].length) {
                    var right = this.layers[z][x+1][y]
                    if (right !== null && right.placed) {
                        var tile = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                        this.layers[z+1][x][y] = tile
                        tile.setTile('tile01')
                        tilenode.parents.push(tile)
                        right.parents.push(tile)
                        tile.children.push(tilenode)
                        tile.children.push(right)
                        tile.setSpritePosition(this.numChildren)
                    }
                }
                break
            case 4:
                break
        }
        this.size++
    }
    removeStudioNode(tilenode) {
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
                }
            }
            tilenode.tile.destroy()
            this.layers[tilenode.z][tilenode.y][tilenode.x] = null
        }
    }
    
}