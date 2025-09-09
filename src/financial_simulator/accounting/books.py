from dataclasses import dataclass, replace
from datetime import date
from decimal import Decimal
from typing import Self, Sequence

from .account import Account
from .transaction import Transaction


@dataclass(frozen=True)
class Books:
    journal: Sequence[Transaction]
    ledger: Account

    @classmethod
    def create(cls, initial_transaction: Transaction) -> Self:
        books = cls(journal=(),
                    ledger=Account(name='ledger',
                                   sub_accounts=()))
        return books.enter_transaction(initial_transaction)

    @classmethod
    def create_empty(cls, initial_date: date) -> Self:
        return cls.create(Transaction.create_empty_open(initial_date))

    def enter_transaction(self,
                          transaction: Transaction) -> Self:
        return Books(journal=tuple(self.journal) + (transaction,),
                     ledger=self.ledger.enter_transaction(transaction.changes))

    def open_journal(self, transaction_date: date) -> Self:
        return replace(self, journal=(Transaction.create_open(transaction_date=transaction_date,
                                                              changes=self.ledger.get_open_changes()),))

    def get_balance(self, account_path: Sequence[str]) -> Decimal:
        return self.ledger.get_balance(account_path)

    def get_total_balance(self, account_path: Sequence[str]) -> Decimal:
        return self.ledger.get_total_balance(account_path)
