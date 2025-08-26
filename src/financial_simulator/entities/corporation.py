from dataclasses import dataclass
from typing import Sequence, Tuple, Self

from financial_simulator.accounting import Books
from financial_simulator.actions import Action
from financial_simulator.amounts import Amount
from financial_simulator.bank_accounts import BankAccount
from financial_simulator.entities.entity import Entity
from financial_simulator.investments.investment import Investment
from financial_simulator.loans import Loan
from financial_simulator.properties import Property
from financial_simulator.providers import Provider
from financial_simulator.salaries import Salary


@dataclass(frozen=True)
class Corporation(Entity):
    books: Books
    operating_expenses: Provider[Amount]
    capital_expenses: Provider[Amount]
    depreciation: Provider[Amount]
    income: Provider[Amount]
    bank_accounts: Sequence[BankAccount]
    investments: Sequence[Investment]
    properties: Sequence[Property]
    loans: Sequence[Loan]
    salaries: Sequence[Salary]

    def _on_action(self, action: Action) -> Tuple[Self, Sequence[Action]]:
        pass
