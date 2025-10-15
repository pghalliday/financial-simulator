from datetime import date
from decimal import Decimal
from itertools import islice
from typing import Sequence, Tuple

from financial_simulator import FinancialSimulator
from financial_simulator.lib.accounting import Books, Change, Transaction
from financial_simulator.lib.entities import Corporation, Entity, Individual
from financial_simulator.lib.factories.bank_accounts import (
    create_abn_amro_personal_current,
    create_abn_amro_personal_savings,
    create_ing_business_current,
)
from financial_simulator.lib.providers import NeverProvider


def init_dummy_days() -> FinancialSimulator:
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

    return FinancialSimulator(
        current_date=initial_date, current_entities=(jack, jill, widgets_ltd)
    )

def get_dummy_days() -> Sequence[Tuple[date, Sequence[Entity]]]:
    fs = init_dummy_days()
    return list(islice(fs, 5000))
