from typing import TYPE_CHECKING, Optional
from uuid import UUID

from ...bank_account import BankAccount
from ...base import NamedAssociation
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .individual_entity import IndividualEntity
else:
    IndividualEntity = "IndividualEntity"


class IndividualEntityBankAccount(NamedAssociation):
    __tablename__ = "individual_entity_bank_account"

    individual_entity_id: Mapped[UUID] = mapped_column(ForeignKey("individual_entity.id"), primary_key=True)
    bank_account_id: Mapped[UUID | None] = mapped_column(ForeignKey("bank_account.id"))

    individual_entity: Mapped[IndividualEntity] = relationship(
        foreign_keys="IndividualEntityBankAccount.individual_entity_id",
        back_populates="bank_accounts",
    )

    bank_account: Mapped[Optional[BankAccount]] = relationship(
        foreign_keys="IndividualEntityBankAccount.bank_account_id",
        back_populates="individual_entities",
    )
