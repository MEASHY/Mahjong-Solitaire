var gameConfig = {
    width: 800,
    height: 1000,
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload: preload,
        create: create
    }

}

function preload() {
    //In theory at this point we should have out tileset selected but for now we don't
    var session = new GameSession();
    session.tiles.main = [
        "Mahjong-Dot-1.jpg",
        "Mahjong-Dot-2.jpg",
        "Mahjong-Dot-3.jpg",
        "Mahjong-Dot-4.jpg",
        "Mahjong-Bamboo-2.jpg",
        "Mahjong-Bamboo-3.jpg",
        "Mahjong-Character-1.jpg"
        ]
    session.tileSetName = "Test"
    session.tileSetSize = 7
    session.layoutName = "layout_test_1.json"
    
    //load the layout file specified by the lobby for later use
    this.load.json('jsonLayout', '/Assets/Layouts/'+session.layoutName)
    
    //load all of the main tiles specified in the game lobby
    var tiles = session.tiles.main
    for (var i = 0; i < tiles.length; i++) {
        //console.log('/Assets/Tilesets/'+session.tileSetName+"/"+tiles[i])
        this.load.image('tile'+i, '/Assets/Tilesets/'+session.tileSetName+"/"+tiles[i])
    }
    
    console.log("Assets loaded!")
}

function create() {
    console.log("creating!")
    this.board = new Board(this)
    console.log("Game created!")
}

function update() {
}

var game = new Phaser.Game(gameConfig)
console.log(game)