from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Amount:
    amount: Decimal
    description: str
