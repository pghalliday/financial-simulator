from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class Action:
    source: Sequence[str]
    destination: Sequence[str]
