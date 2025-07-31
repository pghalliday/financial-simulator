from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import date
from functools import reduce
from typing import List


@dataclass(frozen=True)
class AssetState:
    value: float
    value_at_january_first: float
    actual_return: float


@dataclass(frozen=True)
class AssetEffect:
    dividend: float
    rent: float
    interest: float
    withdrawn: float
    deposited: float
    capital_gain: float


ZERO_ASSET_EFFECT = AssetEffect(dividend=0.0,
                                rent=0.0,
                                interest=0.0,
                                withdrawn=0.0,
                                deposited=0.0,
                                capital_gain=0.0)


def sum_asset_effects(asset_effects: List[AssetEffect]) -> AssetEffect:
    return reduce(lambda x, y: AssetEffect(dividend=x.dividend + y.dividend,
                                           rent=x.rent + y.rent,
                                           interest=x.interest + y.interest,
                                           withdrawn=x.withdrawn + y.withdrawn,
                                           deposited=x.deposited + y.deposited,
                                           capital_gain=x.capital_gain + y.capital_gain),
                  asset_effects, ZERO_ASSET_EFFECT)


class Asset(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'next') and
                callable(subclass.next) or
                NotImplemented)

    @abstractmethod
    def next(self, current_date: date, state: AssetState) -> (AssetState, AssetEffect):
        raise NotImplementedError
