from abc import ABCMeta, abstractmethod
from datetime import date


class Interest(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'next') and
                callable(subclass.next) or
                NotImplemented)

    @abstractmethod
    def next(self, current_date: date, balance: float) -> float:
        raise NotImplementedError
