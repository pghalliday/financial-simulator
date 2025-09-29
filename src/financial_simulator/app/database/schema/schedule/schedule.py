

from financial_simulator.app.database.schema.base import Base, HasId, HasName, HasType


class Schedule(Base, HasId, HasName, HasType):
    __tablename__ = "schedule"

    __mapper_args__ = {
        "polymorphic_identity": "schedule",
        "polymorphic_on": "type",
    }

