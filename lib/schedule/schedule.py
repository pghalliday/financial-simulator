from abc import ABCMeta, abstractmethod
from datetime import date


class Schedule(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'next') and
                callable(subclass.next) or
                NotImplemented)

    @abstractmethod
    def check(self, current_date: date) -> bool:
        raise NotImplementedError
