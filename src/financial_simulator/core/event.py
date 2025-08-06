from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class Event:
    source: Sequence[str]
    complete: bool
