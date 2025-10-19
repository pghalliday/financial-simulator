from ..base import (
    BaseWithType,
)


class Rate(BaseWithType):
    __tablename__ = "rate"

    __mapper_args__ = {
        "polymorphic_identity": "rate",
        "polymorphic_on": "type",
    }
