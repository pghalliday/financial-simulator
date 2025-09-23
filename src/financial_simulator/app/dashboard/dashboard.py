from datetime import date
from decimal import Decimal
from itertools import islice

from dash import html, dcc, Dash
from sqlalchemy import Engine, create_engine

from financial_simulator import Engine as FSEngine
from financial_simulator.app.config import Config
from financial_simulator.lib.accounting import Books, Transaction, Change
from financial_simulator.lib.entities import Individual, Corporation
from financial_simulator.lib.factories.bank_accounts import create_abn_amro_personal_current, \
    create_abn_amro_personal_savings, create_ing_business_current
from financial_simulator.lib.providers import NeverProvider
from financial_simulator.lib.util.data import plot_account_balances


class Dashboard:
    config: Config
    engine: Engine

    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        sqlite_file = self.config.database.sqlite_file
        self.engine = create_engine(f'sqlite:///{sqlite_file}')

    def start(self):
        initial_date = date(2019, 12, 31)

        jack = Individual(name='jack',
                          books=Books.create(Transaction(transaction_date=initial_date,
                                                         description='Initial transaction',
                                                         changes=(Change(amount=Decimal('-100.0'),
                                                                         account_path=('assets', 'bank_accounts',
                                                                                       'current')),
                                                                  Change(amount=Decimal('-5000.0'),
                                                                         account_path=('assets', 'bank_accounts',
                                                                                       'savings')),
                                                                  Change(amount=Decimal('5100.0'),
                                                                         account_path=('liabilities', 'equity'))))),
                          expenses=NeverProvider(),
                          bank_accounts=(create_abn_amro_personal_current('current'),
                                         create_abn_amro_personal_savings('savings')),
                          investments=(),
                          properties=(),
                          loans=())

        jill = Individual(name='jill',
                          books=Books.create(Transaction(transaction_date=initial_date,
                                                         description='Initial transaction',
                                                         changes=(Change(amount=Decimal('-200.0'),
                                                                         account_path=('assets', 'bank_accounts',
                                                                                       'current')),
                                                                  Change(amount=Decimal('-3000.0'),
                                                                         account_path=('assets', 'bank_accounts',
                                                                                       'savings')),
                                                                  Change(amount=Decimal('3200.0'),
                                                                         account_path=('liabilities', 'equity'))))),
                          expenses=NeverProvider(),
                          bank_accounts=(create_abn_amro_personal_current('current'),
                                         create_abn_amro_personal_savings('savings')),
                          investments=(),
                          properties=(),
                          loans=())

        widgets_ltd = Corporation(name='widgets_ltd',
                                  books=Books.create(Transaction(transaction_date=initial_date,
                                                                 description='Initial transaction',
                                                                 changes=(Change(amount=Decimal('-300.0'),
                                                                                 account_path=('assets',
                                                                                               'bank_accounts',
                                                                                               'current')),
                                                                          Change(amount=Decimal('300.0'),
                                                                                 account_path=('liabilities',
                                                                                               'equity'))))),
                                  operating_expenses=NeverProvider(),
                                  capital_expenses=NeverProvider(),
                                  depreciation=NeverProvider(),
                                  income=NeverProvider(),
                                  bank_accounts=(create_ing_business_current('current'),),
                                  investments=(),
                                  properties=(),
                                  loans=(),
                                  salaries=())

        engine = FSEngine(current_date=initial_date,
                          current_entities=(jack, jill, widgets_ltd))
        days = list(islice(engine, 5000))
        current_account_balances_figure = plot_account_balances(days=days,
                                                                account_path=('assets', 'bank_accounts', 'current'),
                                                                columns=('Jack', 'Jill', 'Widgets LTD'),
                                                                title='Savings Account Balances',
                                                                is_debit_account=True)
        savings_account_balances_figure = plot_account_balances(days=days,
                                                                account_path=('assets', 'bank_accounts', 'savings'),
                                                                columns=('Jack', 'Jill', 'Widgets LTD'),
                                                                title='Savings Account Balances',
                                                                is_debit_account=True)
        app = Dash(__name__)
        app.layout = html.Div(
            children=[
                html.H1(children="Financial Simulator"),
                html.P(
                    children=(
                        "Do stuff"
                    ),
                ),
                dcc.Graph(
                    figure=current_account_balances_figure,
                ),
                dcc.Graph(
                    figure=savings_account_balances_figure,
                ),
            ]
        )
        app.run(debug=True)
