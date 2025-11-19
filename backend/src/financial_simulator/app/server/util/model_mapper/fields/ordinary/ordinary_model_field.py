from ..model_field import ModelField
from .ordinary_get_field import OrdinaryGetField
from .ordinary_post_field import OrdinaryPostField
from ...type_vars import (
    POST,
    TABLE,
    GET,
)


class OrdinaryModelField(ModelField[TABLE, GET, POST]):
    def __init__(self) -> None:
        super().__init__(
            get_field=OrdinaryGetField[TABLE, GET](),
            post_field=OrdinaryPostField[TABLE, POST](),
        )
