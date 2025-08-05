# Bank Accounts

State and reducer implementations to keep track of bank account changes.


```python
from datetime import date
from decimal import Decimal, getcontext, FloatOperation

from lib.bank_accounts import BankAccount, BankAccountReducer
from lib.providers import AlwaysProvider
from lib.rates import ContinuousRate
from lib.schedules import DailySchedule
from lib.utils.date import days_in_year

decimal_context = getcontext()
decimal_context.traps[FloatOperation] = True
decimal_context.prec = 1000

START_DATE = date(date.today().year, 1, 1)
# Three years of days
DAYS = range(days_in_year(START_DATE.year) +
             days_in_year(START_DATE.year + 1) +
             days_in_year(START_DATE.year + 2))
RATE_PROVIDER = AlwaysProvider(ContinuousRate(Decimal('0.015')))
STARTING_BALANCE = Decimal('10_000')

INITIAL_STATE = BankAccount(current_date=START_DATE,
                            balance=STARTING_BALANCE)

print(f'Decimal context: {decimal_context}')
print(INITIAL_STATE)
```

    Decimal context: Context(prec=1000, rounding=ROUND_HALF_EVEN, Emin=-999999, Emax=999999, capitals=1, clamp=0, flags=[], traps=[InvalidOperation, DivisionByZero, FloatOperation, Overflow])
    ┌──────────────────┬──────────────────┐
    │ Current date     │ 2025-01-01 : Wed │
    │ Interest applied │         0.000000 │
    │ Interest accrued │         0.000000 │
    │ Balance          │     10000.000000 │
    │ Total            │     10000.000000 │
    └──────────────────┴──────────────────┘


The reducer should be provided with an interest rate and an interest payment schedule.


```python
bank_account_reducer = BankAccountReducer(rate_provider=RATE_PROVIDER,
                                          interest_payment_schedule=DailySchedule())
state = INITIAL_STATE
for day in DAYS:
    state = bank_account_reducer.next(state)
print(state)
```

    ┌──────────────────┬──────────────────┐
    │ Current date     │ 2028-01-01 : Sat │
    │ Interest applied │       456.357219 │
    │ Interest accrued │         0.425366 │
    │ Balance          │     10456.357219 │
    │ Total            │     10456.782585 │
    └──────────────────┴──────────────────┘



