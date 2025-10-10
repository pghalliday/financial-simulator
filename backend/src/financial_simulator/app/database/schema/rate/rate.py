from financial_simulator.app.database.schema.base import (
    HasId,
    HasName,
    HasType,
    db,
)


class Rate(db.Model, HasId, HasName, HasType):
    __mapper_args__ = {
        "polymorphic_identity": "rate",
        "polymorphic_on": "type",
    }
