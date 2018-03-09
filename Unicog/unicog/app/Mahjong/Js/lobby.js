function initLobby () {
    // Package and Layout selections
    $.getJSON('/Assets/Layouts/PackageList.json', initPackages)
    
    // Tileset selection
    $.getJSON('/Assets/Tilesets/SetList.json', initTilesets)
    
    // Background selection
    // TODO
    //$.getJSON('/Assets/Themes/?.json', initBackgrounds)
}

// json is the returned JSON from the list of packages file
function initPackages (json) {
    var session = new GameSession()
    session.packageList = json
    session.packageSelected = null
    session.layoutSelected = null
    
    // Create the packageList from the json
    var packageDropBox = document.getElementById('packageDropBox').options
    for (jIndex = 0; jIndex < json.length; jIndex++) {
        session.packageList[jIndex] = {
            name: json[jIndex],
            layouts: null
        }
        // Add option to selection in lobby
        packageDropBox.add(new Option (session.packageList[jIndex].name, jIndex), jIndex)
    }
    
    // Start initializing all the layouts
    if (session.packageList.length > 0) {
        $.getJSON('/Assets/Layouts/'+session.packageList[0].name+'/layouts.json', initLayouts)
    }
}

// json is the returned JSON from a list of layouts file
function initLayouts (json) {
    var session = new GameSession()
    layoutIndex = 0
    nextPackage = 0
    
    // Iterate through packageList till we find the current package
    for (pIndex = 0; pIndex < session.packageList.length; pIndex++) {
        if (session.packageList[pIndex].layouts === null) {
            // Create and add the list of layouts to the package
            session.packageList[pIndex].layouts = json
            for (jIndex = 0; jIndex < json.length; jIndex++) {
                session.packageList[pIndex].layouts[jIndex] = {
                    name: json[jIndex],
                    index: layoutIndex
                }
                layoutIndex++
            }
            nextPackage = pIndex + 1
            break
        } else {
            layoutIndex += session.packageList[pIndex].layouts.length
        }
    }
    
    // layoutSelected should only be null if this is the first package's layouts
    if (session.layoutSelected === null) {
        // Set to first layout in package, then populate layout selection in lobby
        setLayoutSelected(session, 0, 0)
        addLayouts(session.packageList[0].layouts)
    }
    
    // Keep recursing till we've gone through all the packages
    if (nextPackage < session.packageList.length) {
        $.getJSON('/Assets/Layouts/'+session.packageList[nextPackage].name+'/layouts.json', initLayouts)
    }
}

function addLayouts (layoutList) {
    // Empty layout selection if necessary
    var layoutDropBox = document.getElementById('layoutDropBox').options
    while (layoutDropBox.length !== 0) {
        layoutDropBox.remove(0)
    }
    
    // Add all layouts to selection
    for (i = 0; i < layoutList.length; i++) {
        layoutDropBox.add(new Option (layoutList[i].name, layoutList[i].index), layoutList[i].index)
    }
}

function setLayoutSelected ( session, pIndex, layoutIndex ) {
    session.packageSelected = session.packageList[pIndex].name
    session.layoutSelected = session.packageList[pIndex].layouts[layoutIndex].name
}

// json is the returned JSON from the list of tilesets file
function initTilesets (json) {
    var session = new GameSession()
    session.tilesetList = json
    session.tilesetSelected = null
    
    // Create the tilesetList from the json
    var tilesetDropBox = document.getElementById('tilesetDropBox').options
    for (jIndex = 0; jIndex < json.length; jIndex++) {
        session.tilesetList[jIndex] = {
            name: json[jIndex],
            json: null,
            index: jIndex
        }
        // Add option to selection in lobby
        tilesetDropBox.add(new Option (session.tilesetList[jIndex].name, jIndex), jIndex)
    }
    
    changeTileset(0)
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

function changePackage (pIndex) {
    var session = new GameSession()
    
    // Set to first layout in package, then populate layout selection in lobby
    setLayoutSelected(session, pIndex, 0)
    addLayouts(session.packageList[pIndex].layouts)
}

function changeLayout (layoutIndex) {
    var session = new GameSession()
    
    // Search through packages until the layout matching the index is found
    for (pIndex = 0; pIndex < session.packageList.length; pIndex++) {
        if (layoutIndex < session.packageList[pIndex].layouts.length) {
            setLayoutSelected(session, pIndex, layoutIndex)
            return
        } else {
            layoutIndex -= session.packageList[pIndex].layouts.length
        }
    }
}

function changeTileset (tIndex) {
    var session = new GameSession()
    session.tilesetSelected = session.tilesetList[tIndex]
    
    // Load the tileset info file ahead of time here so it's ready for use in the Phaser preload function
    if (session.tilesetSelected.json === null) {
        $.getJSON('/Assets/Tilesets/'+session.tilesetSelected.name+'/tiles.json', storeTilesetJson)
    }
}

// json is the returned JSON from the tileset info file
function storeTilesetJson (json) {
    var session = new GameSession()
    session.tilesetSelected.json = json
    session.tilesetList[session.tilesetSelected.index] = session.tilesetSelected
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