from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Tuple, Sequence

from .provider import Provider, Provided

T = TypeVar('T')


@dataclass
class SequenceProvider(Provider[T]):
    sequence: Sequence[Tuple[date, T]] = ()

    def __post_init__(self):
        # ensure the sequence is ordered by date
        self.sequence = sorted(self.sequence)

    def get(self, current_date: date) -> Provided[T]:
        if not self.sequence:
            return Provided(values=(),
                            complete=True)
        (value_date, value) = self.sequence[0]
        assert value_date >= current_date, 'Value date must be greater than current date, did we go backwards?'
        if value_date == current_date:
            self.sequence = self.sequence[1:]
            return Provided(values=(value,),
                            complete=not self.sequence)
        return Provided(values=(),
                        complete=False)
