from dataclasses import dataclass
from datetime import date
from typing import TypeVar, Sequence

from .provider import Provider, Provided

T = TypeVar('T')


@dataclass
class NextProvider(Provider[T]):
    providers: Sequence[Provider[T]] = ()

    def get(self, current_date: date) -> T:
        providers_and_provided = tuple((provider, provider.get(current_date))
                                       for provider
                                       in self.providers)
        values = next((sub_values
                       for sub_values
                       in [provided.values
                           for _provider, provided
                           in providers_and_provided]
                       if sub_values), tuple())
        self.providers = tuple(provider
                               for provider, provided
                               in providers_and_provided
                               if not provided.complete)
        return Provided(values=values,
                        complete=not self.providers)
