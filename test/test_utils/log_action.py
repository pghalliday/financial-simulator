from dataclasses import dataclass

from financial_simulator.core import Action


@dataclass(frozen=True)
class LogAction(Action):
    name: str
