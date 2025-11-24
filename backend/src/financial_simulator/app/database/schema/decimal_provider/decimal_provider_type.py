from enum import StrEnum


class DecimalProviderType(StrEnum):
    SCHEDULED = "scheduled_decimal_provider"
    MERGE = "merge_decimal_provider"
    NEXT = "next_decimal_provider"
