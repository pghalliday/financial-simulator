# Rates

A collection of daily rate calculation algorithms.


```python
from calendar import JANUARY, APRIL, JULY, OCTOBER
from dataclasses import dataclass, replace
from datetime import date, timedelta
from decimal import Decimal, getcontext, FloatOperation
from functools import reduce
from typing import Callable

from lib.providers import ScheduledProvider, AnyProvider, AlwaysProvider, Provider
from lib.rates import \
    Rate, \
    ContinuousRate, \
    PeriodicRate, \
    create_banded_rate
from lib.schedules import AnySchedule, YearlySchedule
from lib.utils.date import days_in_year
from lib.utils.print import format_day

decimal_context = getcontext()
decimal_context.traps[FloatOperation] = True
decimal_context.prec = 1000

START_DATE = date(date.today().year, 1, 1)
DAYS = [START_DATE + timedelta(days=day) for day in range(days_in_year(START_DATE.year))]
RATE = Decimal('0.015')
BANDS = {Decimal('0.0'): Decimal('0.10'),
         Decimal('1000.0'): Decimal('0.20'),
         Decimal('2000.0'): Decimal('0.30'),
         Decimal('3000.0'): Decimal('0.40'),
         Decimal('4000.0'): Decimal('0.0')}
STARTING_BALANCE = Decimal('10_000')


@dataclass(frozen=True)
class State:
    balance: Decimal
    accrued: Decimal

    def __str__(self) -> str:
        return f"""Balance: {self.balance:.20}
Accrued: {self.accrued:.20}
Total: {self.balance + self.accrued:.20}"""


INITIAL_STATE = State(balance=STARTING_BALANCE,
                      accrued=Decimal('0'))


def payout(state: State) -> State:
    return State(balance=state.balance + state.accrued,
                 accrued=Decimal('0'))


def accrue(state: State) -> State:
    return replace(state)


class StateUpdater(object):
    calculator: Rate
    updater_provider: Provider[Callable[[State], State]]

    def __init__(self,
                 calculator: Rate,
                 updater_provider: Provider[Callable[[State], State]]):
        self.calculator = calculator
        self.updater_provider = updater_provider

    def update(self, current_date: date, state: State) -> State:
        # apply the payment schedule first
        state = self.updater_provider.get(current_date)(state)
        # then apply the rate and accrue
        return replace(state,
                       accrued=state.accrued + self.calculator.calculate(current_date,
                                                                         state.balance,
                                                                         state.accrued))


ANNUAL_PAYMENT_SCHEDULE = YearlySchedule(JANUARY, 1)
ANNUAL_UPDATER_PROVIDER = AnyProvider([ScheduledProvider(payout, ANNUAL_PAYMENT_SCHEDULE),
                                       AlwaysProvider(accrue)])

QUARTERLY_PAYMENT_SCHEDULE = AnySchedule({'First quarter': YearlySchedule(APRIL, 1),
                                          'Second quarter': YearlySchedule(JULY, 1),
                                          'Third quarter': YearlySchedule(OCTOBER, 1),
                                          'Fourth quarter': YearlySchedule(JANUARY, 1)})
QUARTERLY_UPDATER_PROVIDER = AnyProvider([ScheduledProvider(payout, QUARTERLY_PAYMENT_SCHEDULE),
                                          AlwaysProvider(accrue)])

DAILY_UPDATER_PROVIDER = AlwaysProvider(payout)

print(f'Start Date: {format_day(START_DATE)}')
print(f'Starting balance: {STARTING_BALANCE:.2f}')
print()
print(f'Decimal context: {decimal_context}')
```

    Start Date: 2025-01-01 : Wed
    Starting balance: 10000.00
    
    Decimal context: Context(prec=1000, rounding=ROUND_HALF_EVEN, Emin=-999999, Emax=999999, capitals=1, clamp=0, flags=[], traps=[InvalidOperation, DivisionByZero, FloatOperation, Overflow])


## ContinuousRate

This calculator applies a continuously compounding algorithm, which most accurately reflects a
continuous return given a desired annual rate.


```python
rate = ContinuousRate(RATE)
print(rate)
state_updater = StateUpdater(rate, ANNUAL_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    ContinuousRate: 1.50%
    Balance: 10000
    Accrued: 150.00000000000000000
    Total: 10150.000000000000000



```python
rate = ContinuousRate(RATE)
print(rate)
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    ContinuousRate: 1.50%
    Balance: 10111.981008877791361
    Accrued: 38.018991122208639007
    Total: 10150.000000000000000



```python
rate = ContinuousRate(RATE)
print(rate)
state_updater = StateUpdater(rate, DAILY_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    ContinuousRate: 1.50%
    Balance: 10149.585982644606491
    Accrued: 0.41401735539350891438
    Total: 10150.000000000000000


## PeriodicRate

This calculator applies a periodic compounding algorithm by applying the same rate to the
balance for each day without taking into account the unrealized accrued amount. For a constant
balance, this should provide the same return as the `ContinuousRate`. However,
for a falling balance it will return less and for a rising balance it will return more.


```python
rate = PeriodicRate(RATE, 1)
print(rate)
state_updater = StateUpdater(rate, ANNUAL_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    PeriodicRate: 1 periods: 1.50%
    Balance: 10000
    Accrued: 150.00000000000000000
    Total: 10150.000000000000000



```python
rate = PeriodicRate(RATE, 4)
print(rate)
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    PeriodicRate: 4 periods: 1.50%
    Balance: 10111.981565565267852
    Accrued: 38.018411299158197925
    Total: 10149.999976864426049


> **_NB._** We can see an error here as the total is slightly less than the expected 10,150.
> This is due to an inadequacy in the algorithm. The rate calculation assumes that
> quarters are of equal length. This is not the case and can't really be the case, as years
> cannot be divided into a four equal number of days. We are actually using 3 calendar months
> per quarter.
>
> So why is the result slightly less? This is due to compounding as payments from earlier quarters
> compound more than those from later quarters. There are fewer days in the first
> two quarters than the second two, but the daily rate is the same. This means that fewer days
> of payments are compounded from the first half of the year than if the periods were equal
> length. The fact that those days compound for more time, as the payment is earlier, does not
> compensate for the missing days.


```python
print('Days in first half of the year', (date(2025, 7, 1) - date(2025, 1, 1)).days)
print('Days in second half of the year', (date(2026, 1, 1) - date(2025, 7, 1)).days)

```

    Days in first half of the year 181
    Days in second half of the year 184


> **_NBB._** It may be possible to correct this algorithm, but any solution is likely to throw
> up more problems. For instance what should we do if a period crosses between a regular year
> and a leap year?
>
> For this reason it is probably unwise to use this algorithm and instead just
> use the `ContinuousRate` in simulations as the differences are likely to be
> insignificant.
>
> So why is it here? Well, when investigating how banks calculate interest. It was found that
> this is how they say they do it. For instance: https://www.abnamro.nl/en/personal/savings/interest-rates/when-and-how-often-do-you-receive-interest.html
>
> However, this did not give any indication of how they compensate for unequal quarters or
> leap years. As such, the implementation here is probably wrong anyway, so just don't use it!

## BandedRate

This rate combines a dictionary of rates that will be applied at different balance amounts.


```python
rate = create_banded_rate({k: ContinuousRate(v) for k, v in BANDS.items()})
print(rate)
state_updater = StateUpdater(rate, DAILY_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    ┌─────────────────────────┬────────────────────────┐
    │          Range          │          Rate          │
    ├─────────────────────────┼────────────────────────┤
    │      up to 1000.00      │ ContinuousRate: 10.00% │
    │ from 1000.00 to 2000.00 │ ContinuousRate: 20.00% │
    │ from 2000.00 to 3000.00 │ ContinuousRate: 30.00% │
    │ from 3000.00 to 4000.00 │ ContinuousRate: 40.00% │
    │      above 4000.00      │ ContinuousRate: 0.00%  │
    └─────────────────────────┴────────────────────────┘


    Balance: 10874.373552777960360
    Accrued: 2.4021251449943965929
    Total: 10876.775677922954756



```python
rate = create_banded_rate({k: PeriodicRate(v, 4) for k, v in BANDS.items()})
print(rate)
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(state)
```

    ┌─────────────────────────┬─────────────────────────────────┐
    │          Range          │               Rate              │
    ├─────────────────────────┼─────────────────────────────────┤
    │      up to 1000.00      │ PeriodicRate: 4 periods: 10.00% │
    │ from 1000.00 to 2000.00 │ PeriodicRate: 4 periods: 20.00% │
    │ from 2000.00 to 3000.00 │ PeriodicRate: 4 periods: 30.00% │
    │ from 3000.00 to 4000.00 │ PeriodicRate: 4 periods: 40.00% │
    │      above 4000.00      │  PeriodicRate: 4 periods: 0.00% │
    └─────────────────────────┴─────────────────────────────────┘
    Balance: 10677.028352357823072
    Accrued: 228.15607478725173139
    Total: 10905.184427145074804

