from datetime import date
from decimal import Decimal

from .daily_rate_calculator import DailyRateCalculator
from ..utils.date import days_in_year
from ..utils.rates import annual_to_periodic_daily_rate


class PeriodicDailyRateCalculator(DailyRateCalculator):
    period_count: int

    def __init__(self, period_count: int):
        self.period_count = period_count

    def calculate(self, current_date: date, annual_rate: Decimal, balance: Decimal, accrued: Decimal) -> Decimal:
        return annual_to_periodic_daily_rate(annual_rate,
                                             self.period_count,
                                             days_in_year(current_date.year)) * balance
