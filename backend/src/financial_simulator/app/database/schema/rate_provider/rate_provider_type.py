from enum import StrEnum


class RateProviderType(StrEnum):
    SCHEDULED = "scheduled_rate_provider"
    MERGE = "merge_rate_provider"
    NEXT = "next_rate_provider"
