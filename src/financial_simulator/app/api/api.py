from datetime import date
from decimal import Decimal
from itertools import islice
from typing import Sequence, Tuple

from sqlalchemy import Engine, create_engine

from financial_simulator import FinancialSimulator
from financial_simulator.app.config import Config
from financial_simulator.lib.accounting import Books, Transaction, Change
from financial_simulator.lib.entities import Individual, Corporation, Entity
from financial_simulator.lib.factories.bank_accounts import (
    create_abn_amro_personal_current,
    create_abn_amro_personal_savings,
    create_ing_business_current,
)
from financial_simulator.lib.providers import NeverProvider


class API:
    config: Config
    engine: Engine
    days: Sequence[Tuple[date, Sequence[Entity]]]

    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        sqlite_file = self.config.database.sqlite_file
        self.engine = create_engine(f"sqlite:///{sqlite_file}")

        initial_date = date(2019, 12, 31)

        jack = Individual(
            name="jack",
            books=Books.create(
                Transaction(
                    transaction_date=initial_date,
                    description="Initial transaction",
                    changes=(
                        Change(
                            amount=Decimal("-100.0"),
                            account_path=("assets", "bank_accounts", "current"),
                        ),
                        Change(
                            amount=Decimal("-5000.0"),
                            account_path=("assets", "bank_accounts", "savings"),
                        ),
                        Change(
                            amount=Decimal("5100.0"),
                            account_path=("liabilities", "equity"),
                        ),
                    ),
                )
            ),
            expenses=NeverProvider(),
            bank_accounts=(
                create_abn_amro_personal_current("current"),
                create_abn_amro_personal_savings("savings"),
            ),
            investments=(),
            properties=(),
            loans=(),
        )

        jill = Individual(
            name="jill",
            books=Books.create(
                Transaction(
                    transaction_date=initial_date,
                    description="Initial transaction",
                    changes=(
                        Change(
                            amount=Decimal("-200.0"),
                            account_path=("assets", "bank_accounts", "current"),
                        ),
                        Change(
                            amount=Decimal("-3000.0"),
                            account_path=("assets", "bank_accounts", "savings"),
                        ),
                        Change(
                            amount=Decimal("3200.0"),
                            account_path=("liabilities", "equity"),
                        ),
                    ),
                )
            ),
            expenses=NeverProvider(),
            bank_accounts=(
                create_abn_amro_personal_current("current"),
                create_abn_amro_personal_savings("savings"),
            ),
            investments=(),
            properties=(),
            loans=(),
        )

        widgets_ltd = Corporation(
            name="widgets_ltd",
            books=Books.create(
                Transaction(
                    transaction_date=initial_date,
                    description="Initial transaction",
                    changes=(
                        Change(
                            amount=Decimal("-300.0"),
                            account_path=("assets", "bank_accounts", "current"),
                        ),
                        Change(
                            amount=Decimal("300.0"),
                            account_path=("liabilities", "equity"),
                        ),
                    ),
                )
            ),
            operating_expenses=NeverProvider(),
            capital_expenses=NeverProvider(),
            depreciation=NeverProvider(),
            income=NeverProvider(),
            bank_accounts=(create_ing_business_current("current"),),
            investments=(),
            properties=(),
            loans=(),
            salaries=(),
        )

        fs = FinancialSimulator(
            current_date=initial_date, current_entities=(jack, jill, widgets_ltd)
        )
        self.days = list(islice(fs, 5000))

    def get_days(self) -> Sequence[Tuple[date, Sequence[Entity]]]:
        return self.days
