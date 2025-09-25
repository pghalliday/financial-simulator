from datetime import date, timedelta
from itertools import islice
from typing import Generator, Sequence, Tuple, TypeVar

from financial_simulator.lib.providers import Provider
from financial_simulator.lib.util.format import format_day, format_provided

T = TypeVar('T')


def generate_provider_results(initial_date: date, initial_provider: Provider[T]) -> Generator[
    Tuple[date, Sequence[T] | None]]:
    provider: Provider[T] | None = initial_provider
    current_date = initial_date
    while True:
        if provider is None:
            result = current_date, None
        else:
            provided = provider.get(current_date)
            if provided is None:
                provider = None
                result = current_date, None
            else:
                provider, sequence = provided
                result = current_date, sequence
        yield result
        current_date = current_date + timedelta(days=1)


def print_provided(initial_date: date, initial_provider: Provider[T], number_of_days: int) -> None:
    results = tuple(islice(generate_provider_results(initial_date, initial_provider), number_of_days))
    completed_at = next((result for result in results if result[1] is None), None)
    print(format_provided(results))
    print(f'Completed at: {format_day(completed_at[0]) if completed_at is not None else 'Not completed'}')
