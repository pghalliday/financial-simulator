from abc import ABCMeta, abstractmethod
from datetime import date
from decimal import Decimal


class Rate(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'calculate') and
                callable(subclass.calculate) or
                NotImplemented)

    @abstractmethod
    def calculate(self, current_date: date, balance: Decimal, accrued: Decimal) -> Decimal:
        raise NotImplementedError
