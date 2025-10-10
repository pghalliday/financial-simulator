import logging

from flask import Flask

from financial_simulator.app.config import Config
from financial_simulator.app.database.schema import Scenario, db

logger = logging.getLogger(__name__)

app = Flask(__name__)


@app.route("/scenarios")
def scenarios_list():
    scenarios = db.session.execute(db.select(Scenario).order_by(Scenario.name)).scalars()
    logger.info(scenarios)
    return [scenario.name for scenario in scenarios]


def start_server(config: Config):
    # need to use the absolute path to stop flask-alchemy
    # creating a new file under `src/instance/`
    db_path = config.database.sqlite_file.absolute()
    logger.info(db_path)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    db.init_app(app)
    # Create tables if they don't already exist
    # TODO: do we really want to do this?
    #  We have a different way to dela with migrations
    with app.app_context():
        db.create_all()
    app.run(debug=True)
