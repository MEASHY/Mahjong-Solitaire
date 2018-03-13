function initLobby () {
    $.getJSON('/Assets/Layouts/PackageList.json', function ( packages ) {
        fillDropBox(packages, 'packageDropBox')
        $.getJSON('/Assets/Layouts/'+packages[0]+'/layouts.json', function ( layouts ) {
            fillDropBox(layouts, 'layoutDropBox')
        })
    })
    
    $.getJSON('/Assets/Tilesets/SetList.json', function ( tilesets ) {
        fillDropBox(tilesets, 'tilesetDropBox')
    })
    
    // TODO
    //$.getJSON('/Assets/Themes/???.json', initBackgrounds)
    
    document.getElementById('timerMinuteField').addEventListener('input', changeTimer)
    document.getElementById('timerSecondField').addEventListener('input', changeTimer)
}

function fillDropBox ( jsonName, elementId ) {
    var dropBox = document.getElementById(elementId).options
    for (i = 0; i < jsonName.length; i++) {
        dropBox.add(new Option (jsonName[i], jsonName[i]), i)
    }
}

function changePackage (name) {
    $('#layoutDropBox').empty()
    $.getJSON('/Assets/Layouts/'+name+'/layouts.json', function ( layouts ) {
        fillDropBox(layouts, 'layoutDropBox')
    })
}

function changeTimer () {
    var minuteField = document.getElementById('timerMinuteField')
    var minutes = minuteField.value
    if (!minutes || minutes < 0 || minutes > 59) {
        minutes = 15
        minuteField.value = minutes
    }
    
    var secondField = document.getElementById('timerSecondField').value
    var seconds = secondField.value
    if (!seconds || seconds < 0 || seconds > 59) {
        seconds = 0
        secondField.value = seconds
    }
}

function showLobby () {
    document.getElementById('colorstrip').style.display = 'block'
    document.getElementById('lobbyDiv').style.display = 'block'
    document.getElementById('gameDiv').style.display = 'none'
}

function showGame () {
    var session = new GameSession()
    
    var package = document.getElementById('packageDropBox').value
    var layout = document.getElementById('layoutDropBox').value
    $.getJSON('/Assets/Layouts/'+package+'/'+layout+'.json', function ( json ) {
        var session = new GameSession()
        session.layout = json
    })
    
    var tileset = document.getElementById('tilesetDropBox').value
    $.getJSON('/Assets/Tilesets/'+tileset+'/tiles.json', function ( json ) {
        var session = new GameSession()
        session.tileset = json
    })
    
    session.background = document.getElementById('backgroundDropBox').value
    session.beginnerMode = document.getElementById('beginnerCheck').checked
    
    if (session.timer === null) {
        var minutes = document.getElementById('timerMinuteField').value
        var seconds = document.getElementById('timerSecondField').value
        session.timer = new Timer(parseInt(minutes) * 60 + parseInt(seconds))
    }
    
    document.getElementById('colorstrip').style.display = 'none'
    document.getElementById('lobbyDiv').style.display = 'none'
    document.getElementById('gameDiv').style.display = 'block'
    
    // Timer can only be edited at the start of a session, so hiding it everytime a game starts ensures it can't be accessed again
    document.getElementById('timerDiv').style.display = 'none'
    
    startGame()
}