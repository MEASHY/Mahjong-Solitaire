var gameConfig = {
    width: 800,
    height: 800,
    type: Phaser.AUTO,
    parent: 'gameDiv',
    scene: {
        preload: preload,
        create: create
    }

}

function preload() {
    this.load.image('1Dot', '/Assets/Tilesets/Test/Mahjong-Dot-1.jpg')
    this.load.json('jsonLayout', '/Assets/Layouts/layout_test_easy.json')
    console.log("Assets loaded!")
}

function create() {
    console.log("creating!")
    console.log(this.cache.json.get('jsonLayout'));
    this.board = new Board(this)
    this.currentSelection = 10;  // hold the currently selected tile
    console.log("Game created!")
}

function update() {

}

var game = new Phaser.Game(gameConfig)
console.log(game)