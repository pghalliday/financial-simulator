from __future__ import annotations

from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from decimal import Decimal


@dataclass(frozen=True)
class RateCalculation:
    rate: Rate
    current_date: date
    balance: Decimal
    accrued: Decimal
    calculation: Decimal


class Rate(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'calculate') and
                callable(subclass.calculate) or
                NotImplemented)

    @abstractmethod
    def calculate(self, current_date: date, balance: Decimal, accrued: Decimal) -> RateCalculation:
        raise NotImplementedError
