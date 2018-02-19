var Board = function (scene) {

    var tilesSelected = 0

    var init = function () { 
        this.scene = scene
        //console.log(this.game)
        console.log("new layout!")
        //layout.generateTest()
        //var tile = new tileNode(this.scene, 1, 1, 1, "1Dot")
        //console.log(tile.isSet())
        //var tile = new TileNode(this.scene, 1, 1, 1)
        //tile.setTile("1Dot")
        
        
        
        
        var json = this.scene.cache.json.get('jsonLayout')
        var layout = new Layout(this.scene, json)
        //layout.numChildren = json.header.numChildren
        //layout.uniqueTiles = json.header.uniqueTiles
        //layout.maxDuplicates = json.header.maxDuplicates 
        
        
        
        var session = new GameSession()
        session.numChildren = json.header.numChildren
        var height = json.header.height
        console.log("height = "+height)
        for(var i = 1; i <= height; i++) {
            layout.addJsonLayer(json['layer'+i], i)
        }
        console.log(layout.layers)
        //layout.generateTiles(layout, json.header)
        //layout.layers[2][0][1].findChildren(layout, 1)
        layout.buildHierarchy()
        layout.generateTiles()
        //layout.setAll()
        
        
    };

    var checkMatch = function (){
        
    };

    var checkAvailableMoves = function() {
       
    };

    var shuffle = function (){
        
    };

    init()
};