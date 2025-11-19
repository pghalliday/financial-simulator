from typing import Any

from ..get_field import GetField
from ...type_vars import (
    TABLE,
    GET,
)


class OrdinaryGetField(GetField[TABLE, GET]):
    def map(self, field: str, item: TABLE) -> Any:
        return getattr(item, field)
