from dataclasses import dataclass
from datetime import date

from .action import Action


@dataclass(frozen=True)
class TickAction(Action):
    current_date: date
