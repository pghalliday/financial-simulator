# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %%
from datetime import date
from decimal import Decimal
from itertools import islice

from financial_simulator import Engine
from financial_simulator.accounting import Books, Transaction, Change
from financial_simulator.entities import Individual, Corporation
from financial_simulator.factories.bank_accounts import \
    create_abn_amro_personal_current, \
    create_abn_amro_personal_savings, \
    create_ing_business_current
from financial_simulator.providers import NeverProvider
from financial_simulator.util.data import plot_account_balances

# %% [markdown]
# # Simulation
#
#

# %%
initial_date = date(2019, 12, 31)

jack = Individual(name='jack',
                  books=Books.create(Transaction(transaction_date=initial_date,
                                                 description='Initial transaction',
                                                 changes=(Change(amount=Decimal('-100.0'),
                                                                 account_path=('assets', 'bank_accounts', 'current')),
                                                          Change(amount=Decimal('-5000.0'),
                                                                 account_path=('assets', 'bank_accounts', 'savings')),
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
                                                                 account_path=('assets', 'bank_accounts', 'current')),
                                                          Change(amount=Decimal('-3000.0'),
                                                                 account_path=('assets', 'bank_accounts', 'savings')),
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
                                                                         account_path=('assets', 'bank_accounts',
                                                                                       'current')),
                                                                  Change(amount=Decimal('300.0'),
                                                                         account_path=('liabilities', 'equity'))))),
                          operating_expenses=NeverProvider(),
                          capital_expenses=NeverProvider(),
                          depreciation=NeverProvider(),
                          income=NeverProvider(),
                          bank_accounts=(create_ing_business_current('current'),),
                          investments=(),
                          properties=(),
                          loans=(),
                          salaries=())

engine = Engine(current_date=initial_date,
                current_entities=(jack, jill, widgets_ltd))

days = list(islice(engine, 366))

# %% [markdown]
# ## Current account balances

# %%
fig = plot_account_balances(days=days,
                            account_path=('assets', 'bank_accounts', 'current'),
                            columns=('Jack', 'Jill', 'Widgets LTD'),
                            title='Current Account Balances',
                            is_debit_account=True)
fig.write_image('simulation.assets/current_account_balances.png')
fig.show()

# %% [markdown]
# <!-- INSERT_IMAGE:Current Account Balances:current_account_balances.png -->

# %% [markdown]
# # Savings account balances

# %%
fig = plot_account_balances(days=days,
                            account_path=('assets', 'bank_accounts', 'savings'),
                            columns=('Jack', 'Jill', 'Widgets LTD'),
                            title='Savings Account Balances',
                            is_debit_account=True)
fig.write_image('simulation.assets/savings_account_balances.png')
fig.show()

# %% [markdown]
# <!-- INSERT_IMAGE:Savings Account Balances:savings_account_balances.png -->
