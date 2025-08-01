from dataclasses import dataclass
from datetime import date

from lib.asset.asset import Asset, AssetState, AssetEffect
from lib.rates.interest import Interest
from lib.schedules.schedule import Schedule

@dataclass(frozen=True)
class SavingsAccountState(AssetState):


class SavingsAccount(Asset):
    daily_interest: Interest
    payment_schedule: Schedule

    def __init__(self, daily_interest: Interest, payment_schedule: Schedule):
        self.daily_interest = daily_interest
        self.payment_schedule = payment_schedule

    def next(self, current_date: date, state: AssetState) -> (AssetState, AssetEffect):
        pass