from dataclasses import dataclass, replace
from datetime import date
from typing import TypeVar, Callable, Generic, Sequence, Self, Tuple

from financial_simulator.core import Provider
from financial_simulator.util.providers.never_provider import NeverProvider

T = TypeVar('T')
U = TypeVar('U')


@dataclass(frozen=True)
class MergeMapProvider(Generic[T, U], Provider[T]):
    transform: Callable[[date, U], Provider[T]]
    provider: Provider[U]
    sub_providers: Sequence[Provider[T]] = ()

    def get(self, current_date: date) -> Tuple[Self, Sequence[T]] | None:
        sub_providers = tuple(self.sub_providers)
        provider = self.provider
        # Get new sub providers if our provider has not completed
        if provider is not None:
            # first, get the provided sequence of U
            provided = self.provider.get(current_date)
            if provided is None:
                provider = None
            else:
                provider, sequence = provided
                # for each U, transform to a new Provider
                new_sub_providers = (self.transform(current_date, value) for value in sequence)
                # create a new sequence of sub providers
                sub_providers = sub_providers + tuple(new_sub_providers)
        # get the values from all the sub providers that have not completed
        sub_provided = tuple(sub_provided
                             for sub_provided
                             in (sub_provider.get(current_date)
                                 for sub_provider
                                 in sub_providers)
                             if sub_provided is not None)
        # if the provider and sub providers have all completed, then we have completed
        if provider is None and not sub_provided:
            return None
        sub_providers, sequences = zip(*sub_provided) if sub_provided else ((), ())
        return (replace(self, provider=provider, sub_providers=sub_providers),
                tuple(value
                      for sequence in sequences
                      for value in sequence))
