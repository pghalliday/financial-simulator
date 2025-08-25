from dataclasses import dataclass, replace
from datetime import date
from typing import Self, Sequence

from .account import Account
from .change import Change
from .transaction import Transaction


@dataclass(frozen=True)
class Books:
    journal: Sequence[Transaction]
    ledger: Account

    def enter_transaction(self,
                          transaction_date: date,
                          description: str,
                          changes: Sequence[Change]) -> Self:
        return Books(journal=tuple(self.journal) + (Transaction(transaction_date=transaction_date,
                                                                description=description,
                                                                changes=changes),),
                     ledger=self.ledger.enter_transaction(changes))

    def open_year(self, transaction_date: date) -> Self:
        return replace(self, journal=(Transaction(transaction_date=transaction_date,
                                                  description='Open year',
                                                  changes=self.ledger.open_year()),))
