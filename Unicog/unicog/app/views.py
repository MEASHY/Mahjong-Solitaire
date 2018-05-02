from flask import render_template, send_file, request, send_from_directory, redirect, url_for, session
from app import app, db
from models import Sessions, Bejeweled_Sessions, Wordsearch_Sessions, Mole_Sessions, Researchers, Players, Mahjong_Games
import os
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

@app.route('/mahjong/game.html')
def mahjong_lobby():
    if 'researcher' in session:
        return render_template('Mahjong/game.html')
    else:
        return redirect('mahjong/index.html')
    
@app.route('/mahjong/login.html', methods = ['POST'])
def player_login():
    valid_r = None
    valid_p = None
    player_id = request.form['player']
    try:
        researcher_id = request.form['researcher']
        valid_r = db.session.query(Researchers.r_id).filter_by(r_id = researcher_id).first()
    except:
        pass

    try:
        gID = request.form['useGenericID']
        if (gID == 'on'):
            id = 0        
    except:
        if (not valid_r):
            error_message = 'The Researcher ID you submmitted does not exist'
            return render_template('Mahjong/login.html', error_message=error_message)

    valid_p = db.session.query(Players.user_id).filter_by(user_id = player_id).first()
    try:
        if (request.form['addNewPlayer'] == 'on'):
            if (not valid_p):
                newPlayer = Players(user_id = player_id)
                db.session.add(newPlayer)
                db.session.commit()
            else:
                error_message = 'The Player you have entered already exists'
                return render_template('Mahjong/login.html', error_message=error_message)
    except:
        if (not valid_p):
            error_message = 'The Player ID you submmitted does not exist'
            return render_template('Mahjong/login.html', error_message=error_message)

    session['researcher'] = id
    session['player'] = player_id
    return redirect(url_for('mahjong_lobby')) 
    
  
@app.route('/mahjong_static/research_stats.html', methods = ['POST'])
def mahjong_stats():
    #check that researcher id exists
    id = request.form['researcher']
    valid = None
    if (id.isdigit()):
        valid = db.session.query(Researchers.r_id).filter_by(r_id = id).first()
        
    if (valid == None):
        return redirect(url_for('mahjong_research_login_failed')) #invalid case

    return render_template('Mahjong/research_stats.html', r_id = id)

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

@app.route('/mahjong/<path:filename>')
def mahjong_static_page(filename):
    try:
        return render_template('Mahjong/' + filename)
    except:
        return send_from_directory('Mahjong/', filename)
        
    return send_from_directory('Mahjong/', filename)


@app.route('/mahjong/assets/<path:filename>')
def send_layout(filename):
    return send_from_directory('Mahjong/Assets/', filename)
	
@app.route('/mahjong/assets/Layouts/<path:filename>')
def send_layout(filename):
    return send_from_directory('Mahjong/Assets/Layouts/', filename)

@app.route('/mahjong/assets/Tilesets/<path:filename>')
def send_tiles(filename):
    return send_from_directory('Mahjong/Assets/Tilesets/', filename)

@app.route('/mahjong/assets/Themes/<path:filename>')
def send_backgrounds(filename):
    return send_from_directory('Mahjong/Assets/Themes/', filename)

@app.route('/mahjong/assets/Buttons/<path:filename>')
def send_buttons(filename):
    return send_from_directory('Mahjong/Assets/Buttons/', filename)

@app.route('/mahjong/assets/Audio/<path:filename>')
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

@app.route('/wordSearch/js/<path:filename>')
def send_wordSearch(filename):
    return send_from_directory('/ECAWordSearchV2/js/', filename)
