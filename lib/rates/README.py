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

# %% [markdown] papermill={"duration": 0.010043, "end_time": "2025-08-05T20:43:37.617857", "exception": false, "start_time": "2025-08-05T20:43:37.607814", "status": "completed"}
# # Rates
#
# A collection of daily rate calculation algorithms.

# %% papermill={"duration": 0.054678, "end_time": "2025-08-05T20:43:37.678609", "exception": false, "start_time": "2025-08-05T20:43:37.623931", "status": "completed"}
from datetime import date, timedelta
from decimal import Decimal, getcontext, FloatOperation
from functools import reduce

from lib.rates import \
    ContinuousRate, \
    PeriodicRate, \
    create_banded_rate
from lib.utils.date import days_in_year
from lib.utils.rates.state import \
    State, \
    StateUpdater, \
    ANNUAL_UPDATER_PROVIDER, \
    QUARTERLY_UPDATER_PROVIDER, \
    DAILY_UPDATER_PROVIDER

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

INITIAL_STATE = State(current_date=START_DATE - timedelta(days=1),
                      net_deposits=STARTING_BALANCE,
                      interest_paid=Decimal('0.0'),
                      interest_accrued=Decimal('0.0'))

print(f'Decimal context: {decimal_context}')
print(INITIAL_STATE)

# %% [markdown] papermill={"duration": 0.00211, "end_time": "2025-08-05T20:43:37.683076", "exception": false, "start_time": "2025-08-05T20:43:37.680966", "status": "completed"}
# ## ContinuousRate
#
# This calculator applies a continuously compounding algorithm, which most accurately reflects a
# continuous return given a desired annual rate.

# %% [markdown] papermill={"duration": 0.00187, "end_time": "2025-08-05T20:43:37.686936", "exception": false, "start_time": "2025-08-05T20:43:37.685066", "status": "completed"}
# Each call to calculate will return the daily amount associated with the given annual rate.

# %% papermill={"duration": 0.028025, "end_time": "2025-08-05T20:43:37.716868", "exception": false, "start_time": "2025-08-05T20:43:37.688843", "status": "completed"}
rate = ContinuousRate(RATE)
calculation = rate.calculate(current_date=START_DATE,
                             balance=STARTING_BALANCE,
                             accrued=Decimal('0.0'))
print(calculation)

# %% [markdown] papermill={"duration": 0.001669, "end_time": "2025-08-05T20:43:37.720347", "exception": false, "start_time": "2025-08-05T20:43:37.718678", "status": "completed"}
# So collecting the daily amounts over a full year, we can see the compounded result.

# %% papermill={"duration": 0.017608, "end_time": "2025-08-05T20:43:37.739570", "exception": false, "start_time": "2025-08-05T20:43:37.721962", "status": "completed"}
state_updater = StateUpdater(rate, ANNUAL_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% papermill={"duration": 0.019408, "end_time": "2025-08-05T20:43:37.760803", "exception": false, "start_time": "2025-08-05T20:43:37.741395", "status": "completed"}
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% papermill={"duration": 0.017325, "end_time": "2025-08-05T20:43:37.780031", "exception": false, "start_time": "2025-08-05T20:43:37.762706", "status": "completed"}
state_updater = StateUpdater(rate, DAILY_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% [markdown] papermill={"duration": 0.001706, "end_time": "2025-08-05T20:43:37.783623", "exception": false, "start_time": "2025-08-05T20:43:37.781917", "status": "completed"}
# ## PeriodicRate
#
# This calculator applies a periodic compounding algorithm by applying the same rate to the
# balance for each day without taking into account the unrealized accrued amount. For a constant
# balance, this should provide the same return as the `ContinuousRate`. However,
# for a falling balance it will return less and for a rising balance it will return more.

# %% [markdown] papermill={"duration": 0.001682, "end_time": "2025-08-05T20:43:37.787024", "exception": false, "start_time": "2025-08-05T20:43:37.785342", "status": "completed"}
# Each call to calculate will return the daily amount associated with the given annual rate.

# %% papermill={"duration": 0.004495, "end_time": "2025-08-05T20:43:37.793147", "exception": false, "start_time": "2025-08-05T20:43:37.788652", "status": "completed"}
rate = PeriodicRate(RATE, 1)
calculation = rate.calculate(current_date=START_DATE,
                             balance=STARTING_BALANCE,
                             accrued=Decimal('0.0'))
print(calculation)

# %% [markdown] papermill={"duration": 0.001929, "end_time": "2025-08-05T20:43:37.796854", "exception": false, "start_time": "2025-08-05T20:43:37.794925", "status": "completed"}
# So collecting the daily amounts over a full year, we can see the compounded result.

# %% papermill={"duration": 0.007392, "end_time": "2025-08-05T20:43:37.806006", "exception": false, "start_time": "2025-08-05T20:43:37.798614", "status": "completed"}
state_updater = StateUpdater(rate, ANNUAL_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% papermill={"duration": 0.027976, "end_time": "2025-08-05T20:43:37.835783", "exception": false, "start_time": "2025-08-05T20:43:37.807807", "status": "completed"}
rate = PeriodicRate(RATE, 4)
calculation = rate.calculate(current_date=START_DATE,
                             balance=STARTING_BALANCE,
                             accrued=Decimal('0.0'))
print(calculation)

# %% papermill={"duration": 0.015895, "end_time": "2025-08-05T20:43:37.853512", "exception": false, "start_time": "2025-08-05T20:43:37.837617", "status": "completed"}
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% [markdown] papermill={"duration": 0.001785, "end_time": "2025-08-05T20:43:37.857243", "exception": false, "start_time": "2025-08-05T20:43:37.855458", "status": "completed"}
# > **_NB._** We can see an error here as the total is slightly less than the expected 10,150.
# > This is due to an inadequacy in the algorithm. The rate calculation assumes that
# > quarters are of equal length. This is not the case and can't really be the case, as years
# > cannot be divided into a four equal number of days. We are actually using 3 calendar months
# > per quarter.
# >
# > So why is the result slightly less? This is due to compounding as payments from earlier quarters
# > compound more than those from later quarters. There are fewer days in the first
# > two quarters than the second two, but the daily rate is the same. This means that fewer days
# > of payments are compounded from the first half of the year than if the periods were equal
# > length. The fact that those days compound for more time, as the payment is earlier, does not
# > compensate for the missing days.

# %% papermill={"duration": 0.004449, "end_time": "2025-08-05T20:43:37.863427", "exception": false, "start_time": "2025-08-05T20:43:37.858978", "status": "completed"}
print('Days in first half of the year', (date(2025, 7, 1) - date(2025, 1, 1)).days)
print('Days in second half of the year', (date(2026, 1, 1) - date(2025, 7, 1)).days)


# %% [markdown] papermill={"duration": 0.00181, "end_time": "2025-08-05T20:43:37.867057", "exception": false, "start_time": "2025-08-05T20:43:37.865247", "status": "completed"}
# > **_NBB._** It may be possible to correct this algorithm, but any solution is likely to throw
# > up more problems. For instance what should we do if a period crosses between a regular year
# > and a leap year?
# >
# > For this reason it is probably unwise to use this algorithm and instead just
# > use the `ContinuousRate` in simulations as the differences are likely to be
# > insignificant.
# >
# > So why is it here? Well, when investigating how banks calculate interest. It was found that
# > this is how they say they do it. For instance: https://www.abnamro.nl/en/personal/savings/interest-rates/when-and-how-often-do-you-receive-interest.html
# >
# > However, this did not give any indication of how they compensate for unequal quarters or
# > leap years. As such, the implementation here is probably wrong anyway, so just don't use it!

# %% [markdown] papermill={"duration": 0.001751, "end_time": "2025-08-05T20:43:37.870556", "exception": false, "start_time": "2025-08-05T20:43:37.868805", "status": "completed"}
# ## BandedRate
#
# This rate combines a dictionary of rates that will be applied at different balance amounts.

# %% [markdown] papermill={"duration": 0.001762, "end_time": "2025-08-05T20:43:37.874043", "exception": false, "start_time": "2025-08-05T20:43:37.872281", "status": "completed"}
# Each call to calculate will return the daily amount associated with the given annual rate.

# %% papermill={"duration": 0.109898, "end_time": "2025-08-05T20:43:37.985661", "exception": false, "start_time": "2025-08-05T20:43:37.875763", "status": "completed"}
rate = create_banded_rate({k: ContinuousRate(v) for k, v in BANDS.items()})
calculation = rate.calculate(current_date=START_DATE,
                             balance=STARTING_BALANCE,
                             accrued=Decimal('0.0'))
print(calculation)

# %% [markdown] papermill={"duration": 0.001876, "end_time": "2025-08-05T20:43:37.989662", "exception": false, "start_time": "2025-08-05T20:43:37.987786", "status": "completed"}
# So collecting the daily amounts over a full year, we can see the compounded result.

# %% papermill={"duration": 0.012468, "end_time": "2025-08-05T20:43:38.003915", "exception": false, "start_time": "2025-08-05T20:43:37.991447", "status": "completed"}
state_updater = StateUpdater(rate, DAILY_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)

# %% papermill={"duration": 0.126043, "end_time": "2025-08-05T20:43:38.132056", "exception": false, "start_time": "2025-08-05T20:43:38.006013", "status": "completed"}
rate = create_banded_rate({k: PeriodicRate(v, 4) for k, v in BANDS.items()})
calculation = rate.calculate(current_date=START_DATE,
                             balance=STARTING_BALANCE,
                             accrued=Decimal('0.0'))
print(calculation)

# %% papermill={"duration": 0.015407, "end_time": "2025-08-05T20:43:38.149534", "exception": false, "start_time": "2025-08-05T20:43:38.134127", "status": "completed"}
state_updater = StateUpdater(rate, QUARTERLY_UPDATER_PROVIDER)
final_state = reduce(lambda state, day: state_updater.update(day, state), DAYS, INITIAL_STATE)
print(final_state)
