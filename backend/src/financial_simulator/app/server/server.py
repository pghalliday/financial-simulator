import os

import uvicorn

from financial_simulator.app.config import Config

SQLITE_FILE_ENV_VAR = "FINANCIAL_SIMULATOR_SQLITE_FILE"

def start_server(config: Config):
    os.environ.setdefault(SQLITE_FILE_ENV_VAR, str(config.database.sqlite_file))
    uvicorn.run(
        f"{__package__}.main:app",
        port=5000,
        reload=True,
        reload_dirs=['src/financial_simulator'],
    )
