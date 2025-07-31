from datetime import date
from typing import List, Dict

from lib.interest.interest import Interest
from lib.utils.interest import annual_to_daily_interest_rate


class InterestBand(object):
    lower: float
    upper: float | None
    rate: float

    def __init__(self, lower: float, upper: float | None, rate: float):
        self.lower = lower
        self.upper = upper
        self.rate = rate

    def calculate(self, current_date: date, total_balance: float):
        if total_balance <= self.lower:
            balance = 0
        elif self.upper is None:
            balance = total_balance - self.lower
        elif total_balance >= self.upper:
            balance = self.upper - self.lower
        else:
            balance = total_balance - self.lower
        return balance * annual_to_daily_interest_rate(self.rate, current_date)

class BandedInterest(Interest):
    bands: List[InterestBand]

    def __init__(self, bands: Dict[float, float]):
        sorted_bands = sorted(bands.items())
        if not bands[0.0]:
            sorted_bands = [(0.0, 0.0)] + sorted_bands
        self.bands = []
        last_rate: float | None = None
        last_above: float | None = None
        for above, rate in sorted_bands:
            if last_rate is not None:
                self.bands.append(InterestBand(last_above, above, last_rate))
            last_rate = rate
            last_above = above
        self.bands.append(InterestBand(last_above, None, last_rate))

    def next(self, current_date: date, balance: float) -> float:
        return sum([band.calculate(current_date, balance) for band in self.bands])
