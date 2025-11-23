from enum import StrEnum


class ProviderType(StrEnum):
    ALWAYS = "always_provider"
    SCHEDULED = "scheduled_provider"
    MERGE = "merge_provider"
    NEXT = "next_provider"
