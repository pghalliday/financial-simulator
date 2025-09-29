

from financial_simulator.app.database.schema.base import Base, HasId, HasName, HasType


class Provider(Base, HasId, HasName, HasType):
    __tablename__ = "provider"

    __mapper_args__ = {
        "polymorphic_identity": "provider",
        "polymorphic_on": "type",
    }

