from dataclasses import dataclass, field
from datetime import date
from typing import TypeVar, Callable, Generic

from .merge_provider import MergeProvider
from .never_provider import NeverProvider
from .provider import Provider, Provided

T = TypeVar('T')
U = TypeVar('U')


@dataclass
class MergeMapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[date, U], Provider[T]]
    provider: Provider[U] = NeverProvider()
    __complete: bool = False
    __merge_provider: MergeProvider[T] = field(default_factory=MergeProvider)

    def get(self, current_date: date) -> Provided[T]:
        # first, get the provided sequence of U if not complete
        if not self.__complete:
            provided = self.provider.get(current_date)
            self.__complete = provided.complete
            # for each U, transform to a new Provider
            providers = (self.transform(current_date, value) for value in provided.values)
            # create a new AllProvider
            self.__merge_provider = MergeProvider(tuple(self.__merge_provider.providers) + tuple(providers))
        all_provided = self.__merge_provider.get(current_date)
        return Provided(values=all_provided.values,
                        complete=all_provided.complete and self.__complete)
