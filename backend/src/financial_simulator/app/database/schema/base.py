from uuid import UUID, uuid4

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

constraint_naming_conventions = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=constraint_naming_conventions)


class HasId:
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)


class HasName:
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column()


class HasType:
    type: Mapped[str] = mapped_column()
