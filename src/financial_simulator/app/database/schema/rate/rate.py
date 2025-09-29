from financial_simulator.app.database.schema.base import Base, HasId, HasName, HasType


class Rate(Base, HasId, HasName, HasType):
    __tablename__ = "rate"

    __mapper_args__ = {
        "polymorphic_identity": "rate",
        "polymorphic_on": "type",
    }
