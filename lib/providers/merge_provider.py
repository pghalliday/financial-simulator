from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Sequence

from .provider import Provider, Provided

T = TypeVar('T')


@dataclass
class MergeProvider(Provider[T]):
    providers: Sequence[Provider[T]] = ()

    def get(self, current_date: date) -> Provided[T]:
        providers_and_provided = tuple((provider, provider.get(current_date))
                                       for provider
                                       in self.providers)
        values = tuple(value
                       for sub_values in [provided.values
                                          for _provider, provided in
                                          providers_and_provided]
                       for value in sub_values)
        self.providers = tuple(provider
                               for provider, provided
                               in providers_and_provided
                               if not provided.complete)
        return Provided(values=values,
                        complete=not self.providers)
