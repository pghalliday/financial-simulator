from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..entity import Entity
from ..entity_type import EntityType

if TYPE_CHECKING:
    from ...bank_account import BankAccount
else:
    BankAccount = "BankAccount"


class IndividualEntity(Entity):
    __tablename__ = EntityType.INDIVIDUAL

    id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    bank_accounts: Mapped[List[BankAccount]] = relationship(
        secondary="individual_entity_bank_account",
        back_populates="individual_entities",
    )

    __mapper_args__ = {"polymorphic_identity": EntityType.INDIVIDUAL}


