var Board = function (scene) {

    var tilesSelected = null

    var init = function () { 
        this.scene = scene
        console.log(this.game)
        console.log("new layout!")
        var layout = new Layout(this.scene, 36, 1)
        //layout.generateTest()
        //var tile = new tileNode(this.scene, 1, 1, 1, "1Dot")
        //console.log(tile.isSet())
        //var tile = new TileNode(this.scene, 1, 1, 1)
        //tile.setTile("1Dot")
        
        
        
        
        var json = this.scene.cache.json.get('jsonLayout')
        var depth = json.header.depth
        console.log("DEPTH = "+depth)
        for(var i = 1; i <= depth; i++) {
            layout.addJsonLayer(json['layer'+i], i)
        }
        console.log(layout.layers)
        layout.setAll()
        
        
    };

    var checkMatch = function (){
        
    };

    var checkAvailableMoves = function() {
       
    };

    var shuffle = function (){
        
    };

    init()
};