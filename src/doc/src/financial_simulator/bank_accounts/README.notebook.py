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

# %% [markdown]
# # Bank Accounts
#
# State and reducer implementations to keep track of bank account changes.

# %%
from datetime import date
from decimal import Decimal, getcontext, FloatOperation
from itertools import islice

from financial_simulator import generate_states
from financial_simulator.bank_accounts import BankAccount
from financial_simulator.providers import AlwaysProvider
from financial_simulator.rates import ContinuousRate
from financial_simulator.schedules import DailySchedule
from financial_simulator.util.date import days_in_year

decimal_context = getcontext()
decimal_context.traps[FloatOperation] = True
decimal_context.prec = 1000

# Start on the last day of last year so we create opening states for the first year in our range
START_DATE = date(date.today().year - 1, 12, 31)
# List 3 years from this year
YEARS = [START_DATE.year + offset for offset in range(1, 4)]
# Total number of days in years plus one, so we roll over into another year and create closing states
# for the last year in our range
DAYS = sum([days_in_year(year) for year in YEARS]) + 1
RATE_PROVIDER = AlwaysProvider(ContinuousRate(Decimal('0.015')))
STARTING_BALANCE = Decimal('10_000')

INITIAL_STATE = BankAccount(current_date=START_DATE,
                            action_log=(),
                            balance=STARTING_BALANCE,
                            rate_provider=RATE_PROVIDER,
                            interest_payment_schedule=DailySchedule())

print(f'Decimal context: {decimal_context}')
print(INITIAL_STATE)

# %% [markdown]
# The reducer should be provided with an interest rate and an interest payment schedule.

# %%
*_, last = islice(generate_states(INITIAL_STATE), DAYS)
bank_account, events = last
print(bank_account)

# %% [markdown]
# The state will also provide information on yearly opening and closing balances, etc.

# %%
for year in YEARS:
    print(f'Opening balance for year {year}: {bank_account.opening_balance[year]:.6f}')
    print(f'Closing balance for year {year}: {bank_account.closing_balance[year]:.6f}')
    balance_change = bank_account.closing_balance[year] - bank_account.opening_balance[year]
    print(f'Balance change for year {year}: {balance_change:.6f}')
    print()
    print(f'Opening interest applied for year {year}: {bank_account.opening_interest_applied[year]:.6f}')
    print(f'Closing interest applied for year {year}: {bank_account.closing_interest_applied[year]:.6f}')
    interest_applied_change = bank_account.closing_interest_applied[year] - bank_account.opening_interest_applied[year]
    print(f'Interest applied change for year {year}: {interest_applied_change:.6f}')
    print()
    print(f'Opening interest accrued for year {year}: {bank_account.opening_interest_accrued[year]:.6f}')
    print(f'Closing interest accrued for year {year}: {bank_account.closing_interest_accrued[year]:.6f}')
    interest_accrued_change = bank_account.closing_interest_accrued[year] - bank_account.opening_interest_accrued[year]
    print(f'Interest accrued change for year {year}: {interest_accrued_change:.6f}')
    print()
    interest_change = interest_applied_change + interest_accrued_change
    print(f'Interest change for year {year}: {interest_change:.6f}')
    print()
