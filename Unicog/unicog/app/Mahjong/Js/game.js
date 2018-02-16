import "phaser.min"

var gameConfig = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'gameDiv',

    score: 0
}

function preload() {
    game.load.image('1Dot', 'Assets/Tilsets/Test/Mahjong-Dot-1')

}

function create() {
    game.add.sprite(0, 0, '1Dot')
}

function update() {

}

var game = new Phaser.Game(gameConfig)