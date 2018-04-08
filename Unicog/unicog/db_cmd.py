from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import Sessions, Researchers, Players, Mahjong_Games
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db = SQLAlchemy(app)

# ----- Do any query or addition here