from typing import TYPE_CHECKING, Optional
from uuid import UUID

from ...bank_account import BankAccount
from ...base import NamedAssociation
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .corporation_entity import CorporationEntity
else:
    CorporationEntity = "CorporationEntity"



class CorporationEntityBankAccount(NamedAssociation):
    __tablename__ = "corporation_entity_bank_account"

    corporation_entity_id: Mapped[UUID] = mapped_column(ForeignKey("corporation_entity.id"), primary_key=True)
    bank_account_id: Mapped[UUID | None] = mapped_column(ForeignKey("bank_account.id"))

    corporation_entity: Mapped[CorporationEntity] = relationship(
        foreign_keys="CorporationEntityBankAccount.corporation_entity_id",
        back_populates="bank_accounts",
    )

    bank_account: Mapped[Optional[BankAccount]] = relationship(
        foreign_keys="CorporationEntityBankAccount.bank_account_id",
        back_populates="corporation_entities",
    )
