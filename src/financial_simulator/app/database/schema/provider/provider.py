from financial_simulator.app.database.schema.base import (
    HasId,
    HasName,
    HasType,
    db,
)


class Provider(db.Model, HasId, HasName, HasType):
    __mapper_args__ = {
        "polymorphic_identity": "provider",
        "polymorphic_on": "type",
    }
