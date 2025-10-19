from ..base import (
    BaseWithType,
)


class Provider(BaseWithType):
    __tablename__ = "provider"

    __mapper_args__ = {
        "polymorphic_identity": "provider",
        "polymorphic_on": "type",
    }
