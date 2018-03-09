from flask import render_template, send_file, request, send_from_directory
from app import app

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

@app.route('/mahjong_static/<path:filename>')
def mahjong_static_page(filename):
	return send_from_directory('Mahjong/',filename)

"""
@app.route('/mahjong_game')
def mahjong_game_ind():
	return render_template('Mahjong/game.html')

@app.route('/mahjong_index')
def mahjong_ind():
	return render_template('Mahjong/index.html')

@app.route('/mahjong_player_login')
def mahjong_player_login():
	return render_template('/Mahjong/player_login.html')

@app.route('/mahjong_research_login')
def mahjong_research_login():
	return render_template('/Mahjong/research_login.html')
"""

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

## Mahjong stuff

@app.route('/mahjong/js/<path:filename>')
def mahjong_js_file(filename):
	return send_from_directory('Mahjong/js/',filename)

# Below is old Mahjong Stuff that just no
"""
@app.route('/mahjong/js/phaser.js')
def mahjong_phaser():
	return send_file('Mahjong/js/phaser.js')

@app.route('/mahjong/js/gameSession.js')
def mahjong_gameSession():
	return send_file('Mahjong/js/gameSession.js')

@app.route('/mahjong/js/game.js')
def mahjong_game():
	return send_file('Mahjong/js/game.js')

@app.route('/mahjong/js/tile.js')
def mahjong_tile():
	return send_file('Mahjong/js/tile.js')

@app.route('/mahjong/js/board.js')
def mahjong_board():
	return send_file('Mahjong/js/board.js')

@app.route('/Assets/Layouts/Demo1.json')
def layout_demo1():
	return send_file('Mahjong/Assets/Layouts/Demo1.json')

@app.route('/Assets/Tilesets/Testv2/1.png')
def tile_1():
	return send_file('Mahjong/Assets/Tilesets/Testv2/1.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Bamboo-2.png')
def tile_bamboo_2():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Bamboo-2.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Bamboo-3.png')
def tile_bamboo_3():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Bamboo-3.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Dot-1.png')
def tile_dot_1():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Dot-1.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Dot-2.png')
def tile_dot_2():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Dot-2.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Dot-3.png')
def tile_dot_3():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Dot-3.png')

@app.route('/Assets/Tilesets/Testv2/Mahjong-Dot-4.png')
def tile_dot_4():
	return send_file('Mahjong/Assets/Tilesets/Testv2/Mahjong-Dot-4.png')

"""
