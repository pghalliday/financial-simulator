from ..base import (
    BaseWithType,
)


class Value(BaseWithType):
    __tablename__ = "value"

    __mapper_args__ = {
        "polymorphic_identity": "value",
        "polymorphic_on": "type",
    }
