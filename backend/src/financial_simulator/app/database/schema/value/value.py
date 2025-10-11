from ..base import (
    Base,
    HasId,
    HasName,
    HasType,
)


class Value(Base, HasId, HasName, HasType):
    __tablename__ = "value"

    __mapper_args__ = {
        "polymorphic_identity": "value",
        "polymorphic_on": "type",
    }
