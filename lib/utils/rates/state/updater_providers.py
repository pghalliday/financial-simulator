from calendar import JANUARY, APRIL, JULY, OCTOBER
from dataclasses import replace
from datetime import date
from decimal import Decimal

from .state import State
from ....providers import ScheduledProvider, AnyProvider, AlwaysProvider
from ....schedules import YearlySchedule, AnySchedule


def payout(current_date: date, state: State) -> State:
    return replace(state,
                   current_date=current_date,
                   interest_paid=state.interest_paid + state.interest_accrued,
                   interest_accrued=Decimal('0.0'))


def accrue(current_date: date, state: State) -> State:
    return replace(state,
                   current_date=current_date)


ANNUAL_PAYMENT_SCHEDULE = YearlySchedule(JANUARY, 1)
ANNUAL_UPDATER_PROVIDER = AnyProvider({'payout on January 1st': ScheduledProvider(payout, ANNUAL_PAYMENT_SCHEDULE),
                                       'otherwise accrue': AlwaysProvider(accrue)})

QUARTERLY_PAYMENT_SCHEDULE = AnySchedule({'First quarter': YearlySchedule(APRIL, 1),
                                          'Second quarter': YearlySchedule(JULY, 1),
                                          'Third quarter': YearlySchedule(OCTOBER, 1),
                                          'Fourth quarter': YearlySchedule(JANUARY, 1)})
QUARTERLY_UPDATER_PROVIDER = AnyProvider({'payout on quarters': ScheduledProvider(payout, QUARTERLY_PAYMENT_SCHEDULE),
                                          'otherwise accrue': AlwaysProvider(accrue)})

DAILY_UPDATER_PROVIDER = AlwaysProvider(payout)
