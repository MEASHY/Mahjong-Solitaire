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
                    var left = this.layers[z][y][x-1]
                    if (left !== null && left.placed) {
                        var tile = new StudioTileNode(this.state, x-1, y, z+2, this.numChildren)
                        this.layers[z+1][y][x-1] = tile
                        tile.setTile('tile01')
                        tilenode.parents.push(tile)
                        left.parents.push(tile)
                        tile.children.push(tilenode)
                        tile.children.push(left)
                        tile.setSpritePosition(this.numChildren)
                    }
                }
                if (x+1 < this.layers[z][x].length) {
                    var right = this.layers[z][y][x+1]
                    if (right !== null && right.placed) {
                        var tile = new StudioTileNode(this.state, x, y, z+2, this.numChildren)
                        this.layers[z+1][y][x] = tile
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
                //avoid out of index error...
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
                //actual check
                //top left
                if ((w && nw && n) && (w.placed && nw.placed && n.placed)) {
                    var tile = new StudioTileNode(this.state, x-1, y-1, z+2, this.numChildren)
                    this.layers[z+1][y-1][x-1] = tile
                    tile.setTile('tile01')
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
                    tile.setTile('tile01')
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
                    tile.setTile('tile01')
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
                    tile.setTile('tile01')
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
    
}