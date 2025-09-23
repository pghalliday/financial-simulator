from dataclasses import replace
from typing import Sequence, Tuple

from financial_simulator.lib.providers import Provider
from financial_simulator.lib.schedules import Schedule


def provider_get[T, U](obj: T, attr: str, current_date) -> Tuple[T, Sequence[U]]:
    provider: Provider[U] | None = getattr(obj, attr)
    if provider is None:
        return obj, ()
    provider_and_provided = provider.get(current_date)
    if provider_and_provided is None:
        return replace(obj, **{attr: None}), ()
    provider, provided = provider_and_provided
    return replace(obj, **{attr: provider}), provided


def schedule_check[T](obj: T, attr: str, current_date) -> Tuple[T, bool]:
    schedule: Schedule | None = getattr(obj, attr)
    if schedule is None:
        return obj, False
    schedule_and_scheduled = schedule.check(current_date)
    if schedule_and_scheduled is None:
        return replace(obj, **{attr: None}), False
    schedule, scheduled = schedule_and_scheduled
    return replace(obj, **{attr: schedule}), scheduled
