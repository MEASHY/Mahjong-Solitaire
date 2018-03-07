function initLobby () {
    // Difficulty and Layout selections
    $.getJSON('/Assets/Layouts/LayoutList.json', initLayouts)
    
    // Tileset selection
    $.getJSON('/Assets/Tilesets/SetList.json', initTilesets)
    
    // Background selection
    // TODO
    //$.getJSON('/Assets/Themes/?.json', initBackgrounds)
}

// json is the returned JSON from the list of layouts file
function initLayouts (json) {
    var session = new GameSession()
    session.layoutFiles = json
    session.layoutList = []
    session.layoutTotal = json.length
    session.layoutSelected = null
    
    if (session.layoutTotal > 0) {
        $.getJSON('/Assets/Layouts/'+session.layoutFiles[0]+'.json', checkLayout)
    }
}

// json is the returned JSON from a layout file
function checkLayout (json) {
    // Generate an object based on the JSON and add it to GameSession
    var session = new GameSession()
    var layout = {
        json: json,
        name: json.header.name,
        difficulty: json.header.difficulty,
        index: session.layoutList.length
    }
    session.layoutList.push(layout)
    
    // layoutSelected should only be null if this is the first layout in the list
    if (session.layoutSelected === null) {
        session.layoutSelected = layout
    }
    
    // Add name or difficulty of layout to the selection boxes in the lobby
    addLayout(layout, session.layoutSelected, false)
    
    // Recurse till we've looked through all the layouts
    if (session.layoutList.length !== session.layoutTotal) {
        $.getJSON('/Assets/Layouts/'+session.layoutFiles[session.layoutList.length]+'.json', checkLayout)
    }
}

function addLayout ( layout, selected, justAddLayoutNames ) {
    var matchingDifficulty = layout.difficulty.toUpperCase() === selected.difficulty.toUpperCase()
    
    // Difficulty does match selected layout's, so add new layout to selection
    if (matchingDifficulty) {
        var layoutDropBox = document.getElementById('layoutDropBox').options
        layoutDropBox.add(new Option (layout.name, layout.index), layout.index)
    }
    
    // We only need to add layout names if the difficulty drop box is already populated
    if (justAddLayoutNames) {
        return
    }
    
    // Difficulty doesn't match selected layout's, or layout is same as selected, so add new difficulty to selection
    if (!matchingDifficulty || layout.index === selected.index) {
        var difficultyDropBox = document.getElementById('difficultyDropBox').options
        difficultyDropBox.add(new Option (layout.difficulty, layout.index), layout.index)
    }
}

// json is the returned JSON from the list of tilesets file
function initTilesets (json) {
    var tilesetDropBox = document.getElementById('tilesetDropBox').options
    for (i = 0; i < json.length; i++) {
        tilesetDropBox.add(new Option (json[i], json[i]), i)
    }
    changeTileset(json[0])
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

function changeDifficulty (index) {
    var session = new GameSession()
    session.layoutSelected = session.layoutList[index]
    
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

function changeLayout (index) {
    var session = new GameSession()
    session.layoutSelected = session.layoutList[index]
}

function changeTileset (name) {
    var session = new GameSession()
    session.tilesetName = name
    session.tilesetPath = '/Assets/Tilesets/'+name+'/'
    
    // Load the tileset info file ahead of time here so it's ready for use in the Phaser preload function
    $.getJSON(session.tilesetPath+'tiles.json', storeTilesetJson)
}

// json is the returned JSON from the tileset info file
function storeTilesetJson (json) {
    var session = new GameSession()
    session.tilesetJson = json
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