from dataclasses import dataclass
from decimal import Decimal
from typing import Sequence


@dataclass(frozen=True)
class Change:
    amount: Decimal
    account_path: Sequence[str]
