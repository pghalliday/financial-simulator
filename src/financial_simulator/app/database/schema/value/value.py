from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column

from financial_simulator.app.database.schema.base import Base


class Value(Base):
    __tablename__ = "value"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()

    def __repr__(self) -> str:
        return f"Value(id={self.id!r}, name={self.name!r}, description={self.description!r})"
