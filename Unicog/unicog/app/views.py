from flask import render_template, send_file, request, send_from_directory, redirect, url_for
from app import app, db
from models import Sessions, Bejeweled_Sessions, Wordsearch_Sessions, Mole_Sessions, Researchers, Players, Mahjong_Games
#from sqlalchemy.sql.expression import func

SERVER_URL = 'http://199.116.235.91/'

@app.route('/bejeweled_game', methods = ['POST'])
#@auth.login_required
def bejeweled_game():
    return render_template('Bejeweled/game.html',
                            user_id = request.form['password'],
                            r_id = request.form['username'])

@app.route('/bejeweled_quick', methods = ['POST'])
def bejeweled_quick():
    return render_template('Bejeweled/game.html',
                            user_id = "quicktest",
                            r_id = "quicktest")

@app.route('/wordsearch_quick', methods = ['POST'])
def wordsearch_quick():
    return render_template('ECAWordSearchV2/game.html',
                            user_id = "quicktest",
                            r_id = "quicktest")

@app.route('/wordsearch_game', methods = ['POST'])
#@auth.login_required
def wordsearch_game():
    return render_template('ECAWordSearchV2/game.html',
                            user_id = request.form['password'],
                            r_id = request.form['username'])

@app.route('/bejeweled_index')
def bej_ind():
    return render_template('Bejeweled/index.html')

@app.route('/wordsearch_index')
def word_ind():
    return render_template('ECAWordSearchV2/index.html')
    
# Mahjong Stuff

@app.route('/mahjong_static/mahform.css')
def send_mahjong_css():
    return send_file('static/mahform.css')
    
@app.route('/mahjong_static/game.html', methods = ['POST'])
def mahjong_game():
    valid_r = None
    valid_p = None
    id = request.form['researcher']
    player_id = request.form['player']
    
    if not ((id.isdigit() or id == '') and player_id.isdigit()):
        return redirect(url_for('mahjong_player_login_failed3'))
    
    valid_r = db.session.query(Researchers.r_id).filter_by(r_id = id).first()
    
    try:
        gID = request.form['useGenericID']
        if (gID == 'on'):
            valid_r = True
            id = 0          
    except:
        pass
    
    if (valid_r == None):
        return redirect(url_for('mahjong_player_login_failed')) #invalid case
    
    valid_p = db.session.query(Players.user_id).filter_by(user_id = player_id).first()
    
    try:
        add_new_player = request.form['addNewPlayer']
        if (add_new_player == 'on'):
            newPlayer = Players(user_id = player_id)
            db.session.add(newPlayer)
            db.session.commit()
            valid_p = True
    except:
        pass
    
    if (valid_p == None):
        return redirect(url_for('mahjong_player_login_failed2'))
        
    return render_template('Mahjong/game.html',  
        user_id=player_id, r_id = id)

  
@app.route('/mahjong_static/research_stats.html', methods = ['POST'])
def mahjong_stats():
    #check that researcher id exists
    id = request.form['researcher']
    valid = None
    if (id.isdigit()):
        valid = db.session.query(Researchers.r_id).filter_by(r_id = id).first()
        
    if (valid == None):
        return redirect(url_for('mahjong_research_login_failed')) #invalid case

    return render_template('Mahjong/research_stats.html',  
        r_id = id)

@app.route('/mahjong_static/researcher_stats_filter.html', methods = ['POST'])        
def mahjong_stats_get():
    filter_id = request.form['player']
    researcher = request.form['r_id']
    sessions = db.session.query(Sessions).filter_by(user_id = filter_id, app = 'Mahjong').all()
    mahjong_sessions = []
    for row in sessions:
        mahjong_sessions.append((db.session.query(Mahjong_Games).filter_by(session_id = row.session_id).all(),\
            row.user_id, row.r_id))

    results = '{"sessions": ['
    for sess in mahjong_sessions:
        for game in sess[0]:
            if results[-1] == '}':
                results += ','
            results += '{'
            results += '"session_id": ' + str(game.session_id) + ','
            results += '"game_num": ' + str(game.game_num) + ','
            results += '"player_id": ' + str(sess[1]) + ','
            results += '"r_id": ' + str(sess[2]) + ','
            results += '"package": "' + game.package + '",'
            results += '"layout": "' + game.layout + '",'
            results +=  '"selections": ' + str(game.selections) + ','
            results +=  '"deselections": ' + str(game.deselections) + ','
            results +=  '"correct_matches": ' + str(game.correct_matches) + ','
            results +=  '"incorrect_matches": ' + str(game.incorrect_matches) + ','
            results +=  '"hints_enabled": ' + str(game.hints_enabled).lower() + ','
            results +=  '"hints": ' + str(game.hints) + ','
            results +=  '"shuffles": ' + str(game.shuffles) + ','
            results +=  '"time_taken":' + str(game.time_taken) + ','
            results +=  '"completion": "' + game.completion + '"}'          
    results += ']}'
    return render_template('Mahjong/research_stats.html', r_id = researcher, user_id = filter_id, query_result = results)

@app.route('/mahjong_static/<path:filename>')
def mahjong_static_page(filename):
    try:
        return render_template('Mahjong/' + filename)
    except:
        return send_from_directory('Mahjong/', filename)
        
    return send_from_directory('Mahjong/', filename)

@app.route('/mahjong_static/player_login_failed.html')
def mahjong_player_login_failed():
    return render_template('Mahjong/player_login.html', error_message =
        'The Researcher ID you submmitted does not exist')
        
@app.route('/mahjong_static/player_login_failed2.html')
def mahjong_player_login_failed2():
    return render_template('Mahjong/player_login.html', error_message =
        'The Player ID you submitted does not exist, make sure to add it to the database')

@app.route('/mahjong_static/player_login_failed3.html')
def mahjong_player_login_failed3():
    return render_template('Mahjong/player_login.html', error_message =
        'The Researcher and Player IDs must be numeric values')
        
@app.route('/mahjong_static/research_login_failed.html')        
def mahjong_research_login_failed():
    return render_template('Mahjong/research_login.html', error_message =
        'The Researcher ID you submmitted does not exist')
    
@app.route('/Assets/Layouts/<path:filename>')
def send_layout(filename):
    return send_from_directory('Mahjong/Assets/Layouts/', filename)

@app.route('/Assets/Tilesets/<path:filename>')
def send_tiles(filename):
    return send_from_directory('Mahjong/Assets/Tilesets/', filename)

@app.route('/Assets/Themes/<path:filename>')
def send_backgrounds(filename):
    return send_from_directory('Mahjong/Assets/Themes/', filename)

@app.route('/Assets/Buttons/<path:filename>')
def send_buttons(filename):
    return send_from_directory('Mahjong/Assets/Buttons/', filename)

@app.route('/Assets/Audio/<path:filename>')
def send_audio(filename):
    return send_from_directory('Mahjong/Assets/Audio/', filename)
    

#too be fixed up with this style http://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask

@app.route('/js/phaser.min.js')
def phaser():
    return send_file('Bejeweled/js/phaser.min.js')

@app.route('/js/menu.js')
def menu():
    return send_file('Bejeweled/js/menu.js')

@app.route('/js/stats.js')
def stats():
    return send_file('Bejeweled/js/stats.js')

@app.route('/js/event.js')
def events():
    return send_file('Bejeweled/js/event.js')

@app.route('/js/timer.js')
def timer():
    return send_file('Bejeweled/js/timer.js')

@app.route('/js/counter.js')
def counter():
    return send_file('Bejeweled/js/counter.js')

@app.route('/js/game.js')
def game():
    return send_file('Bejeweled/js/game.js')

@app.route('/js/tile.js')
def tile():
    return send_file('Bejeweled/js/tile.js')

@app.route('/js/board.js')
def board():
    return send_file('Bejeweled/js/board.js')

## Wordsearch stuff

@app.route('/wordsearch/js/phaser.min.js')
def word_phaser():
    return send_file('ECAWordSearchV2/js/phaser.min.js')

@app.route('/wordsearch/js/stats.js')
def word_stats():
    return send_file('ECAWordSearchV2/js/stats.js')

@app.route('/wordsearch/js/event.js')
def word_event():
    return send_file('ECAWordSearchV2/js/event.js')

@app.route('/wordsearch/js/timer.js')
def word_timer():
    return send_file('ECAWordSearchV2/js/timer.js')

@app.route('/wordsearch/js/counter.js')
def word_counter():
    return send_file('ECAWordSearchV2/js/counter.js')

@app.route('/wordsearch/js/game.js')
def word_game():
    return send_file('ECAWordSearchV2/js/game.js')

@app.route('/wordsearch/js/tile.js')
def word_tile():
    return send_file('ECAWordSearchV2/js/tile.js')

@app.route('/wordsearch/js/board.js')
def word_board():
    return send_file('ECAWordSearchV2/js/board.js')

