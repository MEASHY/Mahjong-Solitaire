function initLobby () {
    var session = new GameSession()
    
    // Package and Layout selections
    $.getJSON('/Assets/Layouts/PackageList.json', initPackages)
    
    // Tileset selection
    $.getJSON('/Assets/Tilesets/SetList.json', initTilesets)
    
    // Background selection
    // TODO
    //$.getJSON('/Assets/???.json', initBackgrounds)
    
    // In seconds, how often a check to tick down the timer occurs
    session.timerTickCheck = 1
    
    // Ranges are [Min,Max]
    session.minuteField = document.getElementById('timerMinuteField')
    session.minuteMin = 1
    session.minuteMax = 59
    session.minuteDefault = 15
    session.secondField = document.getElementById('timerSecondField')
    session.secondMin = 0
    session.secondMax = 59
    session.secondDefault = 0
    
    // Set up HTML
    session.minuteField.min = session.minuteMin
    session.minuteField.max = session.minuteMax
    session.minuteField.value = session.minuteDefault
    session.minuteField.addEventListener('input', changeTimer)
    session.secondField.min = session.secondMin
    session.secondField.max = session.secondMax
    session.secondField.value = session.secondDefault
    session.secondField.addEventListener('input', changeTimer)
    
    // session.timerRemaining is, in seconds, the amount of time remaining until the session ends
    changeTimer()
    
    // First set timer to paused since we're in the lobby, then start the background function
    pauseTimer()
    setInterval(runTimer, session.timerTickCheck*1000, session, session.timerTickCheck)
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
    } else {
        console.log('Package and layout selection loaded successfully!')
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
    console.log('Tileset selection loaded successfully!')
}

// 
function initBackgrounds (json) {
    // TODO
    // Placeholder until Backgrounds are implemented on the Phaser side of things
    
    //console.log('Background selection loaded successfully!')
}

// Function that runs every amount seconds to tick the timer down, calls endTimer when time is out
function runTimer ( session, amount ) {
    if (session.timerRunning) {
        session.timerRemaining -= amount
        if (session.timerRemaining <= 0) {
            endTimer()
        }
    }
}

function pauseTimer () {
    var session = new GameSession()
    session.timerRunning = false
}

function resumeTimer () {
    var session = new GameSession()
    session.timerRunning = true
}

function endTimer () {
    // TODO
    // Do some sort of end screen
    // Take them back to player login?
}

function showLobby () {
    document.getElementById('colorstrip').style.display = 'block'
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
    
    endGame()
}

// gameType is 'beginner' or 'normal' from game.html
function showGame (gameType) {
    document.getElementById('colorstrip').style.display = 'none'
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    resumeTimer()
    // Timer can only be edited at the start of a session, so hiding it everytime a game starts ensures it can't be accessed again
    document.getElementById('timer').style.display = 'none'
    
    startGame(gameType)
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
    // TODO
}

function changeTimer () {
    var session = new GameSession()
    
    // Constrain minutes to [Min,Max] and set to Default if outside range
    var minutes = session.minuteField.value
    if (!minutes || minutes < session.minuteMin || minutes > session.minuteMax) {
        minutes = session.minuteDefault
        session.minuteField.value = minutes
    }
    
    // Constrain seconds to [Min,Max] and set to Default if outside range
    var seconds = session.secondField.value
    if (!seconds || seconds < session.secondMin || seconds > session.secondMax) {
        seconds = session.secondDefault
        session.secondField.value = seconds
    }
    
    session.timerRemaining = parseInt(minutes) * 60 + parseInt(seconds)
}