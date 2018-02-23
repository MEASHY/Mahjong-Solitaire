var gameConfig = {
    width: 1600,
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
        "Mahjong-Dot-1.png",
        "Mahjong-Dot-2.png",
        "Mahjong-Dot-3.png",
        "Mahjong-Dot-4.png",
        "Mahjong-Bamboo-2.png",
        "Mahjong-Bamboo-3.png",
        "1.png"
        ]
    session.tileSetName = "Testv2"
    session.tileSetSize = 7
    session.layoutName = "Demo2_break.json"
    session.tileFaceX = 100,
    session.tileFaceY = 160,
    session.tileX = 110,
    session.tileY = 169,
    
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