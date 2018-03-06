function initLobby () {
    // Difficulty and Layout selections
    $.getJSON('/Assets/Layouts/LayoutList.json', initLayouts)
    
    // Tileset selection
    $.getJSON('/Assets/Tilesets/SetList.json', initTilesets)
    
    // Background selection
    // TODO
    //$.getJSON('/Assets/Themes/?.json', initBackgrounds)
}

function initLayouts (json) {
    var session = new GameSession()
    session.layoutFiles = json
    session.layoutList = []
    session.layoutTotal = json.length
    session.layoutSelected = null
    
    if (session.layoutTotal>0) {
        $.getJSON('/Assets/Layouts/'+session.layoutFiles[0]+'.json', checkLayout)
    }
}

function checkLayout (json) {
    var session = new GameSession()
    var layout = {
        json: json,
        name: json.header.name,
        difficulty: json.header.difficulty,
        index: session.layoutList.length
    }
    session.layoutList.push(layout)
    
    if (session.layoutSelected === null) {
        session.layoutSelected = layout
    }
    
    addLayout(layout, session.layoutSelected, false)
    
    // Keep going till we've looked through all the layouts
    if (session.layoutList.length !== session.layoutTotal) {
        $.getJSON('/Assets/Layouts/'+session.layoutFiles[session.layoutList.length]+'.json', checkLayout)
    }
}

function addLayout ( layout, selected, justAddLayoutNames ) {
    // Difficulty does match selected, so add new layout to selection
    if (layout.difficulty.toUpperCase() === selected.difficulty.toUpperCase()) {
        var layoutDropBox = document.getElementById('layoutDropBox').options
        layoutDropBox.add(new Option (layout.name, layout.name), layoutDropBox.length)
    }
    
    // We only need to add layout names if the difficulty drop box is already populated
    if (justAddLayoutNames) {
        return
    }
    
    // Difficulty doesn't match selected, or layout is same as selected, so add new difficulty to selection
    if (layout.difficulty.toUpperCase() !== selected.difficulty.toUpperCase() || layout.index === selected.index) {
        var difficultyDropBox = document.getElementById('difficultyDropBox').options
        difficultyDropBox.add(new Option (layout.difficulty, layout.difficulty), difficultyDropBox.length)
    }
}

function initTilesets (json) {
    var tilesetDropBox = document.getElementById('tilesetDropBox').options
    for (i = 0; i < json.length; i++) {
        tilesetDropBox.add(new Option (json[i], json[i]), i)
    }
}

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

function changeDifficulty (difficulty) {
    var session = new GameSession()
    for (i = 0; i < session.layoutList.length; i++) {
        if (difficulty.toUpperCase() === session.layoutList[i].difficulty.toUpperCase()) {
            session.layoutSelected = session.layoutList[i]
            break
        }
    }
    
    // Empty layout selection
    var layoutDropBox = document.getElementById('layoutDropBox').options
    while (layoutDropBox.length !== 0) {
        layoutDropBox.remove(0)
    }
    
    // Fill layout selection with layouts matching newly selected difficulty
    for (i = 0; i < session.layoutList.length; i++) {
        addLayout(session.layoutList[i], session.layoutSelected, true)
    }
}

function changeLayout (name) {
    var session = new GameSession()
    for (i = 0; i < session.layoutList.length; i++) {
        if (name === session.layoutList[i].name) {
            session.layoutSelected = session.layoutList[i]
            break
        }
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