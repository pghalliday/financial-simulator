from financial_simulator.app.database.schema.base import (
    HasId,
    HasName,
    HasType,
    db,
)


class Schedule(db.Model, HasId, HasName, HasType):
    __mapper_args__ = {
        "polymorphic_identity": "schedule",
        "polymorphic_on": "type",
    }
