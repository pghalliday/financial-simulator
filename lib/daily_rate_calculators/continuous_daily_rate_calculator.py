from datetime import date
from decimal import Decimal

from .daily_rate_calculator import DailyRateCalculator
from ..utils.date import days_in_year
from ..utils.rates import annual_to_continuous_daily_rate


class ContinuousDailyRateCalculator(DailyRateCalculator):
    def calculate(self, current_date: date, annual_rate: Decimal, balance: Decimal, accrued: Decimal) -> Decimal:
        return annual_to_continuous_daily_rate(annual_rate,
                                               days_in_year(current_date.year)) * (balance + accrued)
