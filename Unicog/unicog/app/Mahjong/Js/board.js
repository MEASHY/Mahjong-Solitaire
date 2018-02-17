var Board = function (scene) {

    var tilesSelected = 0

    var init = function () { 
        this.scene = scene
        console.log(this.game)
        console.log("new layout!")
        var layout = new Layout(this.scene, 36, 1)
        layout.generateTest()
        //var tile = new tileNode(this.scene, 1, 1, 1, "1Dot")
        //console.log(tile.isSet())
        //var tile = new Tile(this.scene, 1, 1, 1, "1Dot")
        
        
    };

    var checkMatch = function (){
        
    };

    var checkAvailableMoves = function() {
       
    };

    var shuffle = function (){
        
    };

    init()
};