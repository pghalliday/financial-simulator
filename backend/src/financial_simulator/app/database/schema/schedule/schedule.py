from ..base import (
    BaseWithType,
)


class Schedule(BaseWithType):
    __tablename__ = "schedule"

    __mapper_args__ = {
        "polymorphic_identity": "schedule",
        "polymorphic_on": "type",
    }
