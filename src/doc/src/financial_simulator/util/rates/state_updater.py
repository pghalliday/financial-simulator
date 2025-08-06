from dataclasses import replace, dataclass
from datetime import date
from typing import Callable

from doc.src.financial_simulator.util.rates import State
from financial_simulator.core import Provider
from financial_simulator.util.rates import Rate


@dataclass
class StateUpdater(object):
    rate: Rate
    updater_provider: Provider[Callable[[date, State], State]]

    def update(self, current_date: date, state: State) -> State:
        # apply the payment schedule first
        provider, updater = self.updater_provider.get(current_date)
        self.updater_provider = provider
        state = updater[0](current_date, state)
        # calculate the accrual
        calculation = self.rate.calculate(current_date,
                                          state.net_deposits + state.interest_paid,
                                          state.interest_accrued)
        # then apply the rate and accrue
        return replace(state,
                       interest_accrued=state.interest_accrued + calculation.calculation)
