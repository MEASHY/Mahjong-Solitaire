#!/usr/bin/python
import sys

activate_this = 'home/ubuntu/unicog/Backend/flask/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

sys.path.insert(0, "/home/ubuntu/unicog/Backend")

from app import app as application

