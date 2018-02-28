function showLobby () {
    document.getElementById('colorstrip').style.display = 'block'
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
    endGame()
}

function showGame () {
    document.getElementById('colorstrip').style.display = 'none'
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    startGame()
}

function changeDifficulty (value) {
    if (value == '1') {
        document.getElementById('difficultyText').innerHTML = 'Difficulty 1'
    } else if (value == '2') {
        document.getElementById('difficultyText').innerHTML = 'Difficulty 2'
    } else if (value == '3') {
        document.getElementById('difficultyText').innerHTML = 'Difficulty 3'
    }
}

function changeTileset (value) {
    if (value == '1') {
        document.getElementById('tilesetText').innerHTML = 'Tileset 1'
    } else if (value == '2') {
        document.getElementById('tilesetText').innerHTML = 'Tileset 2'
    } else if (value == '3') {
        document.getElementById('tilesetText').innerHTML = 'Tileset 3'
    }
}

function changeBackground (value) {
    if (value == '1') {
        document.getElementById('backgroundText').innerHTML = 'Background 1'
    } else if (value == '2') {
        document.getElementById('backgroundText').innerHTML = 'Background 2'
    } else if (value == '3') {
        document.getElementById('backgroundText').innerHTML = 'Background 3'
    }
}

function changeLayout (value) {
    if (value == '1') {
        document.getElementById('layoutText').innerHTML = 'Layout 1'
    } else if (value == '2') {
        document.getElementById('layoutText').innerHTML = 'Layout 2'
    } else if (value == '3') {
        document.getElementById('layoutText').innerHTML = 'Layout 3'
    }
}