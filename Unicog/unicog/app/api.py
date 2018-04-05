from __future__ import print_function
from app import app, db
from flask import jsonify, abort, make_response, request, Response
from models import Sessions, Bejeweled_Sessions, Wordsearch_Sessions, Mole_Sessions, Researchers, Mahjong_Games
from sqlalchemy.sql.expression import func
import sys
import json



@app.route('/api/v1/create_bejeweled_session', methods=['POST'])
def create_bejeweled():
	if not all(param in request.json for param in ('user_id', 'r_id', 'app', 'session_date', 'attempt', 'level', 'target_score', 'tile_types', 'score_total', 'score_zone', 'latency_average', 'events' )):
		return jsonify({'errors': {"missing_fields": "please supply all required fields"}}), 400
	
	attempt = request.json.get('attempt')
	r_id = request.json.get('r_id')
	app = request.json.get('app')
	user_id = request.json.get('user_id')
	session_date = request.json.get('session_date')

	if attempt == 1:
		b_sess = Sessions(app = app, r_id = r_id, user_id = user_id, session_date = session_date)
		db.session.add(b_sess)
		db.session.commit()
		db.session.refresh(b_sess)
		s_id = b_sess.session_id
	else:
		s_id = db.session.query(func.max(Sessions.session_id)).filter_by(r_id = r_id, user_id = user_id, app = app).first()[0]

	elist = json.dumps(request.json.get('events'))
	bejeweled_session = Bejeweled_Sessions(session_id = s_id, attempt_number = attempt,
		level = request.json.get('level'),
		target_score = request.json.get('target_score'),
		tile_types = request.json.get('tile_types'),
		score_total = request.json.get('score_total'),
		score_zone = request.json.get('score_zone'),
		latency_average = request.json.get('latency_average'),
		events = elist)
	db.session.add(bejeweled_session)
	db.session.commit()

	return jsonify({'session_created': "successfully created bejeweled session"}) , 201

@app.route('/api/v1/create_wordsearch_session', methods=['POST'])
def create_wordsearch():
	if not all(param in request.json for param in ('user_id', 'r_id', 'app', 'session_date', 'attempt' , 'version', 'level', 'rows', 'words', 'latency_average', 'longest_word', 'longest_pause', 'events' )):
		return jsonify({'errors': {"missing_fields": "please supply all required fields"}}), 400
	
	attempt = request.json.get('attempt')
	r_id = request.json.get('r_id')
	app = request.json.get('app')
	user_id = request.json.get('user_id')
	session_date = request.json.get('session_date')

	if attempt == 1:
		w_sess = Sessions(app = app, r_id = r_id, user_id = user_id, session_date = session_date)
		db.session.add(w_sess)
		db.session.commit()
		db.session.refresh(w_sess)
		s_id = w_sess.session_id
	else:
		s_id = db.session.query(func.max(Sessions.session_id)).filter_by(r_id = r_id, user_id = user_id, app = app).first()[0]
	elist = json.dumps(request.json.get('events'))
	wordsearch_session = Wordsearch_Sessions(session_id = s_id, attempt_number = attempt,
		level = request.json.get('level'),
		version = request.json.get('version'),
		rows = request.json.get('rows'),
		words = request.json.get('words'),
		latency_average = request.json.get('latency_average'),
		longest_word = request.json.get('longest_word'),
		longest_pause = request.json.get('longest_pause'),
		events = elist)
	db.session.add(wordsearch_session)
	db.session.commit()

	status_code = 201
	return jsonify({'session_created': "successfully created wordsearch session"}) , 201

@app.route('/api/v1/create_mole_session', methods = ['POST'])
def create_mole():
	if not all(param in request.json for param in ('r_id', 'user_id', 'app', 'session_date', 'target_visibility', 'target_latency', 'attempt_duration', 'level_progression', 'hit_sound', 'hit_vibration', 'avg_reaction_time', 'reaction_time_sd', 'avg_reaction_times_by_attempt', 'reaction_time_sds_by_attempt', 'moles_hit_by_attempt', 'moles_missed_by_attempt', 'bunnies_hit_by_attempt', 'bunnies_missed_by_attempt', 'events')):
		return jsonify({'errors': {"missing_fields": "please supply all required fields"}}), 400

	m_sess = Sessions(app = request.json.get('app'), r_id = request.json.get('r_id'), user_id = request.json.get('user_id'), session_date = request.json.get('session_date'))
	db.session.add(m_sess)
	db.session.commit()
	db.session.refresh(m_sess)
	s_id = m_sess.session_id

	elist = json.dumps(request.json.get('events'))
	avg_reaction_attempt = json.dumps(request.json.get('avg_reaction_times_by_attempt'))
	sds_attempt = json.dumps(request.json.get('reaction_time_sds_by_attempt'))
	moles_hit_attempt = json.dumps(request.json.get('moles_hit_by_attempt'))
	moles_missed_attempt = json.dumps(request.json.get('moles_missed_by_attempt'))
	bunnies_hit_attempt = json.dumps(request.json.get('bunnies_hit_by_attempt'))
	bunnies_missed_attempt = json.dumps(request.json.get('bunnies_missed_by_attempt'))

	mole_session = Mole_Sessions(session_id = s_id,
		target_visibility = request.json.get('target_visibility'),
		target_latency = request.json.get('target_latency'),
		attempt_duration = request.json.get('attempt_duration'),
		level_progression = request.json.get('level_progression'),
		hit_sound = request.json.get('hit_sound'),
		hit_vibration = request.json.get('hit_vibration'),
		avg_reaction_time = request.json.get('avg_reaction_time'),
		reaction_time_sd = request.json.get('reaction_time_sd'),
		avg_reaction_time_by_attempt = avg_reaction_attempt,
		reaction_time_sds_by_attempt = sds_attempt,
		moles_hit_by_attempt = moles_hit_attempt,
		moles_missed_by_attempt = moles_missed_attempt,
		bunnies_hit_by_attempt = bunnies_hit_attempt,
		bunnies_missed_by_attempt = bunnies_missed_attempt,
		events = elist)
	db.session.add(mole_session)
	db.session.commit()

	return jsonify({'session_created': "successfully created mole session"}) , 201

@app.route('/api/v1/get_level_version', methods = ['POST'])
def get_version():
	if not all (param in request.json for param in ('user_id', 'level')):
		return jsonify({'errors': {"missing_fields": "please supply all required fields"}}), 400

	version = db.session.query(Wordsearch_Sessions.version).filter_by(level = request.json.get('level')).join(Sessions).filter_by( user_id = request.json.get('user_id')).filter(Sessions.session_id == Wordsearch_Sessions.session_id)

	if not version.count():
		version = 0
	else:
		nmax = 0
		for i  in range (version.count()):
			if (version[i].version  >= nmax):
				nmax = version[i].version + 1
		version = nmax
	return jsonify({'version':version}), 200
    
    
@app.route('/api/v1/create_mahjong_session', methods=['POST'])
def create_mahjong():
	stats = request.get_json(force = True)
	#return jsonStats

	if not all(param in stats for param in ('gameNumber','package','layout','selections',
    'deselections','correctMatches','incorrectMatches','hintsEnabled','hintsUsed','timesShuffled','completion','startGameTime','endGameTime' )):
		return jsonify({'errors': {"missing_fields": "please supply all required fields"}}), 400

	if stats.get('gameNumber') == 1:
		m_sess = Sessions(app = 'Mahjong', r_id = 'generic researcher', user_id = 'dummy user', session_date = 'today')
		db.session.add(m_sess)
		db.session.commit()
		db.session.refresh(m_sess)
		s_id = m_sess.session_id
	else:
		s_id = db.session.query(func.max(Sessions.session_id)).filter_by(r_id = 'generic researcher', user_id = 'dummy user', app = 'Mahjong').first()[0]

	mahjong_session = Mahjong_Games(session_id = s_id, 
										game_num = stats.get('gameNumber'),
										package = stats.get('package'),
										layout = stats.get('layout'),
										selections = stats.get('selections'),
										deselections = stats.get('deselections'),
										correct_matches = stats.get('correctMatches'),
										incorrect_matches = stats.get('incorrectMatches'),
										hints_enabled = stats.get('hintsEnabled'),
										hints = stats.get('hintsUsed'),
										shuffles = stats.get('timesShuffled'),
										time_taken = stats.get('endGameTime') - stats.get('startGameTime'),
										completion = stats.get('completion')
										)
	db.session.add(mahjong_session)
	db.session.commit()

	return jsonify({'session_created': "successfully created mahjong session"}) , 201
