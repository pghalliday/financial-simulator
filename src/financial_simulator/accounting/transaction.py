from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Sequence

from .change import Change


@dataclass(frozen=True)
class Transaction:
    date: date
    description: str
    changes: Sequence[Change]

    def __post_init__(self):
        # Check that the credits and debits are equal
        total_changes = sum(changes.amount for changes in self.changes)
        assert total_changes == Decimal('0.0'), f'Credits and debits in transactions must balance: {self}'
