from flask import Flask

from financial_simulator.app.config import Config
from financial_simulator.app.server.globals import init_db_engine

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, World!'

def start_server(config: Config):
    init_db_engine(config)
    app.run(debug=True)
