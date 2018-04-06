
var gameConfig = {
    width: 500,
    height: 500,
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload:preload,
        create:create
    }
}
function preload() {
    this.load.image('testTile', './Assets/Tilesets/Test/1.png')
    runTests(this)
}

function create() {
    //this.tileNode1 = new TileNode (this, 1, 1, 1, 4)
    //this.tileNode1.setTile('testTile')
    //runTests(this)
    console.log("wow")
}

var game = new Phaser.Game(gameConfig)

function runTests(state) {
    describe('tileNodeSuite', function(){
        var tileNode1 = new TileNode (state, 1, 1, 1, 4)
        var tileNode2 = new TileNode (state, 1, 1, 1, 4)
        var tileNode3 = new TileNode (state, 1, 1, 1, 4)
        var tileNode4 = new TileNode (state, 0, 0, 2, 4)
        var parent1 = new TileNode (state, 1, 1, 1, 4)
        var parent2 = new TileNode (state, 1, 1, 1, 4)
        var parent3 = new TileNode (state, 1, 1, 1, 4)
        var parent4 = new TileNode (state, 1, 1, 1, 4)
        var parent5 = new TileNode (state, 1, 1, 1, 4)
        var child1 = new TileNode (state, 0, 0, 1, 4)
        var child2 = new TileNode (state, 1, 0, 1, 4)
        var child3 = new TileNode (state, 0, 1, 1, 4)
        var child4 = new TileNode (state, 1, 1, 1, 4)
        var child5 = new TileNode (state, 1, 1, 1, 4)
        
        tileNode1.parents.push(parent1)
        tileNode1.parents.push(parent2)
        tileNode1.parents.push(parent3)
        tileNode1.children.push(child1)
        tileNode1.children.push(child2)
        tileNode1.children.push(child3)
        tileNode1.children.push(child4)
        
        tileNode2.parents.push(parent4)
        tileNode2.parents.push(parent5)
        tileNode2.children.push(child4)
        tileNode2.children.push(child5)
        
        tileNode1.setTile('testTile')
        tileNode2.setTile('testTile')
        tileNode3.setTile('testTile')
        parent1.setTile('testTile')
        parent2.setTile('testTile')
        parent3.setTile('testTile')
        parent4.setTile('testTile')
        child1.setTile('testTile')
        child2.setTile('testTile')
        child3.setTile('testTile')
        child4.setTile('testTile')
        
        it("TileNode constructs correctly", function() {
            expect(tileNode1).toBeDefined()
            expect(tileNode1).not.toBeNull()
            expect(tileNode1.state).not.toBeNull()
            expect(tileNode1.x).toEqual(1)
            expect(tileNode1.y).toEqual(1)
            expect(tileNode1.z).toEqual(0)
        })
        
        it("TileNode isSet function works", function() {
            expect(tileNode1.isSet()).toBe(true)
            expect(tileNode4.isSet()).toBe(false)
        })
        
        it("TileNode tile is set properly", function() {
            expect(tileNode1.tile).toBeDefined()
            expect(tileNode1.tile).not.toBeNull()
            expect(tileNode1.tile.depth).toEqual(1001001)
            expect(tileNode1.tile)
        })
        
        
        tileNode1.highlightTile()
        var tint1 = tileNode1.tile.tintBottomLeft
        it("TileNode highlights properly", function() {
            expect(tint1).toEqual(10157567)
        })
        
        tileNode1.dimTile()
        var tint2 = tileNode1.tile.tintBottomLeft
        it("TileNode dims properly", function() {
            expect(tint2).toEqual(13421772)            
        })
        
        tileNode1.unhighlightTile()
        var tint3 = tileNode1.tile.tintBottomLeft
        it("TileNode unhighlights properly", function() {
            expect(tint3).toEqual(16777215)            
        })
        
        it("TileNode allParentsGenerated working!", function() {
            expect(tileNode1.allParentsGenerated()).toBe(true)
            expect(tileNode2.allParentsGenerated()).toBe(false)
            expect(tileNode3.allParentsGenerated()).toBe(true)
        })
        
        it("TileNode allChildrenGenerated working!", function() {
            expect(tileNode1.allChildrenGenerated()).toBe(true)
            expect(tileNode2.allChildrenGenerated()).toBe(false)
            expect(tileNode3.allChildrenGenerated()).toBe(true)
        })
        
        tileNode4.parents.push(parent1)
        tileNode4.parents.push(parent2)
        tileNode4.parents.push(parent3)
        tileNode4.parents.push(parent4)
        tileNode4.parents.push(parent5)
        tileNode4.removeParent(parent2)
        
        it("TileNode removeParent working!", function() {
            expect(tileNode4.parents.length).toBe(4)
            expect(tileNode4.parents[0] != parent2).toBe(true)
            expect(tileNode4.parents[1] != parent2).toBe(true)
            expect(tileNode4.parents[2] != parent2).toBe(true)
            expect(tileNode4.parents[3] != parent2).toBe(true)
        })
        
        var layout = {"layers": []}
        layout.layers.push([[child1, child2],[child3,child4]])
        
        tileNode4.findChildren(layout, 4)
        
        it("TileNode removeParent working!", function() {
            expect(tileNode4.parents.length).toBe(4)
            expect(tileNode4.children[0] == child1).toBe(true)
            expect(tileNode4.children[1] == child2).toBe(true)
            expect(tileNode4.children[2] == child3).toBe(true)
            expect(tileNode4.children[3] == child4).toBe(true)
        })
    
    
    
    
    
    })
    
}
