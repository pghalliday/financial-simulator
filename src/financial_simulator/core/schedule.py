from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Self, Tuple


@dataclass(frozen=True)
class Schedule(metaclass=ABCMeta):
    @abstractmethod
    def check(self, current_date: date) -> Tuple[Self, bool] | None:
        raise NotImplementedError
