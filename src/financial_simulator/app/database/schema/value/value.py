from financial_simulator.app.database.schema.base import (
    HasId,
    HasName,
    HasType,
    db,
)


class Value(db.Model, HasId, HasName, HasType):
    __mapper_args__ = {
        "polymorphic_identity": "value",
        "polymorphic_on": "type",
    }
