from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Callable, Generic, Sequence

from .never_provider import NeverProvider
from .provider import Provider, Provided

T = TypeVar('T')
U = TypeVar('U')


@dataclass
class FlatMapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[U], Sequence[T]]
    provider: Provider[U] = NeverProvider()
    __complete: bool = False

    def get(self, current_date: date) -> Provided[T]:
        values: Sequence[T] = ()
        if not self.__complete:
            provided = self.provider.get(current_date)
            self.__complete = provided.complete
            values = tuple(t_value
                           for sequence in (self.transform(u_value)
                                            for u_value
                                            in provided.values)
                           for t_value in sequence)
        return Provided(values=values,
                        complete=self.__complete)
