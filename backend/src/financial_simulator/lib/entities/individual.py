from dataclasses import dataclass
from typing import Self, Sequence, Tuple

from financial_simulator.lib.actions import Action
from financial_simulator.lib.amounts import Amount
from financial_simulator.lib.bank_accounts import BankAccount
from financial_simulator.lib.entities.entity import Entity
from financial_simulator.lib.investments.investment import Investment
from financial_simulator.lib.loans import Loan
from financial_simulator.lib.properties import Property
from financial_simulator.lib.providers import Provider


@dataclass(frozen=True)
class Individual(Entity):
    expenses: Provider[Amount]
    bank_accounts: Sequence[BankAccount]
    investments: Sequence[Investment]
    properties: Sequence[Property]
    loans: Sequence[Loan]

    def _on_action(self, action: Action) -> Tuple[Self, Sequence[Action]]:
        return self, ()
