from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class Schedule(metaclass=ABCMeta):
    @abstractmethod
    def check(self, current_date: date) -> bool:
        raise NotImplementedError
