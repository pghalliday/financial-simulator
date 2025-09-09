from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Sequence, Self

from .change import Change


@dataclass(frozen=True)
class Transaction:
    transaction_date: date
    description: str
    changes: Sequence[Change]

    @classmethod
    def create_empty_open(cls, transaction_date: date) -> Self:
        return cls(transaction_date=transaction_date,
                   description='Open',
                   changes=())

    @classmethod
    def create_open(cls, transaction_date: date, changes: Sequence[Change]) -> Self:
        return cls(transaction_date=transaction_date,
                   description='Open',
                   changes=changes)

    def __post_init__(self):
        # Check that the credits and debits are equal
        total_changes = sum(changes.amount for changes in self.changes)
        assert total_changes == Decimal('0.0'), f'Credits and debits in transactions must balance: {self}'
