from flask import render_template, send_file, request, send_from_directory
from app import app, db
from models import Sessions, Bejeweled_Sessions, Wordsearch_Sessions, Mole_Sessions, Researchers
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
    id = request.form['researcher']
    valid = db.session.query(Researchers.r_id, id).filter_by(r_id = id).first()
    if (valid == None):
        return send_file('Mahjong/player_login.html') #invalid case
    return render_template('Mahjong/game.html',  
        user_id=request.form['player'], r_id = id)
        
@app.route('/mahjong_static/research_stats.html', methods = ['POST'])
def mahjong_stats():
    #check that researcher id exists
    #check DB for r_id?   
    #testlogin = Researchers(r_id = 12345678)
    #db.session.add(testlogin)
    #db.session.commit()  
    id = request.form['researcher']
    valid = db.session.query(Researchers.r_id, id).filter_by(r_id = id).first()
    #print(valid)
    if (valid == None):
        return send_file('Mahjong/research_login.html') #invalid case
    else:
        return render_template('Mahjong/research_stats.html',  
            r_id = id)

@app.route('/mahjong_static/<path:filename>')
def mahjong_static_page(filename):
    return send_from_directory('Mahjong/',filename)


@app.route('/Assets/Layouts/<path:filename>')
def send_layout(filename):
    return send_from_directory('Mahjong/Assets/Layouts/',filename)

@app.route('/Assets/Tilesets/<path:filename>')
def send_tiles(filename):
    return send_from_directory('Mahjong/Assets/Tilesets/',filename)


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

