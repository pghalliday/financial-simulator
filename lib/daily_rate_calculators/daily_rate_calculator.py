from abc import ABCMeta, abstractmethod
from datetime import date
from decimal import Decimal


class DailyRateCalculator(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'calculate') and
                callable(subclass.calculate) or
                NotImplemented)

    @abstractmethod
    def calculate(self, current_date: date, annual_rate: Decimal, balance: Decimal, accrued: Decimal) -> Decimal:
        raise NotImplementedError
