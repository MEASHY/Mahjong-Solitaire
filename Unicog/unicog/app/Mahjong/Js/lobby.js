/**
 * Initializes the lobby with values from assets
 * @function initLobby
 */
function initLobby () {
    // From https://stackoverflow.com/a/46115659
    // Can add date to end of getJSON calls to cache bust
    $.getJSON('/Assets/Layouts/PackageList.json?'+(new Date()).getTime(), function ( packages ) {
        fillDropBox(packages, 'packageDropBox')
        $.getJSON('/Assets/Layouts/'+packages[0]+'/layouts.json?'+(new Date()).getTime(), function ( layouts ) {
            fillDropBox(layouts, 'layoutDropBox')
        })
    })
    
    $.getJSON('/Assets/Tilesets/SetList.json?'+(new Date()).getTime(), function ( tilesets ) {
        fillDropBox(tilesets, 'tilesetDropBox')
    })
    
    $.getJSON('/Assets/Themes/ThemeList.json?'+(new Date()).getTime(), function ( backgrounds ) {
        fillDropBox(backgrounds, 'themeDropBox')
    })
    
    document.getElementById('timerMinuteField').addEventListener('input', changeTimer)
    document.getElementById('timerSecondField').addEventListener('input', changeTimer)
    
    gameStats.user = user
    gameStats.researcher = researcher
}
/**
 * generic dropBox filling function. takes an element and populates it with the elements of a json array
 * @function fillDropBox
 * @param {json[]} json - json array of options 
 */
function fillDropBox ( json, elementId ) {
    var dropBox = document.getElementById(elementId).options
    for (i = 0; i < json.length; i++) {
        dropBox.add(new Option(json[i], json[i]), i)
    }
}
/**
 * When a user selects a new package load which layouts are available in that package and display them
 * @function changePackage
 * @param {string} name - the name of the package selected
 */
function changePackage (name) {
    $('#layoutDropBox').empty()
    $.getJSON('/Assets/Layouts/'+name+'/layouts.json?'+(new Date()).getTime(), function ( layouts ) {
        fillDropBox(layouts, 'layoutDropBox')
    })
}
/**
 * Constrains the values available to the user to 1-59 minutes
 * @function changeTimer
 */
function changeTimer () {
    var minuteField = document.getElementById('timerMinuteField')
    var minutes = minuteField.value
    if (!minutes || minutes < 0 || minutes > 59) {
        minutes = 15
        minuteField.value = minutes
    }
    
    var secondField = document.getElementById('timerSecondField')
    var seconds = secondField.value
    if (!seconds || seconds < 0 || seconds > 59) {
        seconds = 0
        secondField.value = seconds
    }
}
/**
 * changes the lobby Divs to visible and hides the gameDiv
 * @function showLobby
 */
function showLobby () {
    if (gameSession.timer !== null) {
        document.getElementById('timerMinuteField').value = gameSession.timer.getJustMinutesLeft()
        document.getElementById('timerSecondField').value = gameSession.timer.getJustSecondsLeft()
    }
    
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
}
/**
 * Loads assets for the game and places them in the GameSession
 * @function showGame
 * @see GameSession
 */
function showGame (practiceGame) {
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    gameSession.theme = document.getElementById('themeDropBox').value
    gameSession.beginnerMode = document.getElementById('beginnerCheck').checked
    gameSession.enabledHints = document.getElementById('hintCheck').checked
    gameSession.practiceGame = practiceGame
    
    var packageName = document.getElementById('packageDropBox').value
    var layoutName = document.getElementById('layoutDropBox').value
    
    if (!practiceGame) {
        // Statistics for game information
        gameStats.package = packageName
        gameStats.layout = layoutName
        gameStats.hintsEnabled = gameSession.enabledHints
    }
    
    // getJSON is asynchronous, so nesting the rest inside it ensures everything is loaded when startGame is called   
    $.getJSON('/Assets/Layouts/'+packageName+'/'+layoutName+'.json?'+(new Date()).getTime(), function ( layout ) {
        gameSession.layout = layout
        
        var tileset = document.getElementById('tilesetDropBox').value
        $.getJSON('/Assets/Tilesets/'+tileset+'/tiles.json?'+(new Date()).getTime(), function ( tileset ) {
            gameSession.tileset = tileset
            console.log("Tileset loaded")
            console.log(gameSession.theme)
            
            $.getJSON('/Assets/Themes/' + gameSession.theme + '/Colours.json?'+(new Date()).getTime(), function ( colours ){
                gameSession.colours = colours
            
                if (!practiceGame) {
                    if (gameSession.timer === null) {
                        var minutes = document.getElementById('timerMinuteField').value
                        var seconds = document.getElementById('timerSecondField').value
                        gameSession.timer = new Timer(parseInt(minutes) * 60 + parseInt(seconds))
                        
                        document.getElementById('timerMinuteField').disabled = true
                        document.getElementById('timerSecondField').disabled = true
                        document.getElementById('timerText').innerText = 'Time Left in Session'
                    } else {
                        gameSession.timer.resumeTimer()
                    }
                }
                startGame()        
            })
        })
    })
}
