from dataclasses import dataclass
from datetime import date
from decimal import Decimal

from .rate import Rate
from ..utils.date import days_in_year
from ..utils.rates import annual_to_continuous_daily_rate


@dataclass(frozen=True)
class ContinuousRate(Rate):
    annual_rate: Decimal

    def __str__(self):
        return f'ContinuousRate: {self.annual_rate * 100:.2f}%'

    def calculate(self, current_date: date, balance: Decimal, accrued: Decimal) -> Decimal:
        return annual_to_continuous_daily_rate(self.annual_rate,
                                               days_in_year(current_date.year)) * (balance + accrued)
