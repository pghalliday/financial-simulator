from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class AccountChange:
    amount: Decimal
    transaction_index: int
