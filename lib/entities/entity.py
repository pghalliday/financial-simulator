from abc import ABCMeta, abstractmethod
from datetime import date
from dataclasses import dataclass


@dataclass(frozen=True)
class EntityState:
    pass


class Entity(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'next') and
                callable(subclass.next) or
                NotImplemented)

    @abstractmethod
    def next(self, current_date: date, state: EntityState) -> EntityState:
        raise NotImplementedError
