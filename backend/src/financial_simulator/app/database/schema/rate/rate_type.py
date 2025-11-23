from enum import StrEnum


class RateType(StrEnum):
    PERIODIC = "periodic_rate"
    CONTINUOUS = "continuous_rate"
    BANDED = "banded_rate"
