from dataclasses import dataclass
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
                          date: date,
                          description: str,
                          changes: Sequence[Change]) -> Self:
        transaction_index = len(self.journal)
        return Books(journal=tuple(self.journal) + (Transaction(date=date,
                                                                description=description,
                                                                changes=changes),),
                     ledger=self.ledger.enter_transaction(transaction_index=transaction_index,
                                                          changes=changes))

    def open_year(self, date: date) -> Self:
        ledger, changes = self.ledger.open_year()
        return Books(journal=(Transaction(date=date,
                                          description='Open year',
                                          changes=changes),),
                     ledger=ledger)
