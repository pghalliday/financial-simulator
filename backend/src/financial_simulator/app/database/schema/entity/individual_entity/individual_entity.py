from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..entity import Entity
from ..entity_type import EntityType
from .individual_entity_bank_account import IndividualEntityBankAccount


class IndividualEntity(Entity):
    __tablename__ = EntityType.INDIVIDUAL

    id: Mapped[UUID] = mapped_column(ForeignKey("entity.id"), primary_key=True)

    bank_accounts: Mapped[List[IndividualEntityBankAccount]] = relationship(
        back_populates="individual_entity",
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {"polymorphic_identity": EntityType.INDIVIDUAL}
