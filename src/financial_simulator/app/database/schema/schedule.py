from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Schedule(Base):
    __tablename__ = "schedule"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()
