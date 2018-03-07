var gameConfig = {
    width: 1600,
    height: 1000,
     backgroundColor: '#00422c',
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload: preload,
        create: create
    }

}

function preload () {
    var session = new GameSession();
    var json = session.tilesetJson
    
    // Put all the information in GameSession
    session.tiles.main = json.main
    session.tilesetSize = json.size
    session.tileFaceX = json.tileFaceX
    session.tileFaceY = json.tileFaceY
    session.tileX = json.tileX
    session.tileY = json.tileY
    
    // Load all of the main tiles specified in the tileset info file
    var tiles = session.tiles.main
    for (var i = 0; i < tiles.length; i++) {
        this.load.image('tile'+i, session.tilesetPath+tiles[i])
    }
    
    console.log('Assets loaded!')
}

function create () {
    console.log('creating!')
    this.board = new Board(this)
    console.log('Game created!')
}

function update () {
}

function startGame () {
    var game = new Phaser.Game(gameConfig)
    console.log(game)
}

function endGame () {
    // This will have to close the game when that is implemented, it's a placeholder for now
}