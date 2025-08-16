# Bank Accounts

State and reducer implementations to keep track of bank account changes.


```python
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
```

    Decimal context: Context(prec=1000, rounding=ROUND_HALF_EVEN, Emin=-999999, Emax=999999, capitals=1, clamp=0, flags=[], traps=[InvalidOperation, DivisionByZero, FloatOperation, Overflow])
    ┌──────────────────┬──────────────────┐
    │ Current date     │ 2024-12-31 : Tue │
    │ Interest applied │         0.000000 │
    │ Interest accrued │         0.000000 │
    │ Balance          │     10000.000000 │
    │ Total            │     10000.000000 │
    └──────────────────┴──────────────────┘


The reducer should be provided with an interest rate and an interest payment schedule.


```python
*_, last = islice(generate_states(INITIAL_STATE), DAYS)
bank_account, events = last
print(bank_account)
```

    ┌──────────────────┬──────────────────┐
    │ Current date     │ 2028-01-01 : Sat │
    │ Interest applied │       457.209133 │
    │ Interest accrued │         0.000000 │
    │ Balance          │     10457.209133 │
    │ Total            │     10457.209133 │
    └──────────────────┴──────────────────┘


The state will also provide information on yearly opening and closing balances, etc.


```python
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
```

    Opening balance for year 2025: 10000.000000
    Closing balance for year 2025: 10150.000000
    Balance change for year 2025: 150.000000
    
    Opening interest applied for year 2025: 0.000000
    Closing interest applied for year 2025: 150.000000
    Interest applied change for year 2025: 150.000000
    
    Opening interest accrued for year 2025: 0.000000
    Closing interest accrued for year 2025: 0.000000
    Interest accrued change for year 2025: 0.000000
    
    Interest change for year 2025: 150.000000
    
    Opening balance for year 2026: 10150.000000
    Closing balance for year 2026: 10302.250000
    Balance change for year 2026: 152.250000
    
    Opening interest applied for year 2026: 150.000000
    Closing interest applied for year 2026: 302.250000
    Interest applied change for year 2026: 152.250000
    
    Opening interest accrued for year 2026: 0.000000
    Closing interest accrued for year 2026: 0.000000
    Interest accrued change for year 2026: 0.000000
    
    Interest change for year 2026: 152.250000
    
    Opening balance for year 2027: 10302.250000
    Closing balance for year 2027: 10456.783750
    Balance change for year 2027: 154.533750
    
    Opening interest applied for year 2027: 302.250000
    Closing interest applied for year 2027: 456.783750
    Interest applied change for year 2027: 154.533750
    
    Opening interest accrued for year 2027: 0.000000
    Closing interest accrued for year 2027: 0.000000
    Interest accrued change for year 2027: 0.000000
    
    Interest change for year 2027: 154.533750
    

