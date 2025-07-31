from datetime import date

from lib.asset.asset import Asset, AssetState, AssetEffect
from lib.amount.cash_schedule import Schedule


class Investment(Asset):
    expected_growth_rate: float
    dividend_schedule: Schedule
    reinvest_dividends: bool
    deposit_schedule: Schedule
    withdrawal_schedule: Schedule

    def __init__(self,
                 expected_growth_rate: float,
                 dividend_schedule: Schedule = None,
                 reinvest_dividends: bool = False,
                 deposit_schedule: Schedule = None,
                 withdrawal_schedule: Schedule =None):
        self.expected_growth_rate = expected_growth_rate
        self.dividend_schedule = dividend_schedule
        self.reinvest_dividends = reinvest_dividends
        self.deposit_schedule = deposit_schedule
        self.withdrawal_schedule = withdrawal_schedule

    def next(self, current_date: date, state: AssetState) -> (AssetState, AssetEffect):
        pass
