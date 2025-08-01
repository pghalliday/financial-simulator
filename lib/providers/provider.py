from abc import ABCMeta, abstractmethod
from datetime import date
from typing import TypeVar, Generic

T = TypeVar('T')


class Provider(Generic[T], metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'get') and
                callable(subclass.get) or
                NotImplemented)

    @abstractmethod
    def get(self, current_date: date) -> T:
        raise NotImplementedError
