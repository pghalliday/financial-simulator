from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema import DecimalProviderType
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.util.dependent import DependentGet
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from .decimal_provider_dependent import decimal_provider_dependent_get_mapper, DecimalProviderDependentGet
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    AssociationModelField,
    ModelMapper,
    ChildrenModelField,
)


class DecimalProviderPost(TypedBaseModel[DecimalProviderType]):
    name: str
    description: str | None = None


class DecimalProviderGet(TypedBaseModel[DecimalProviderType]):
    id: UUID
    name: str
    description: str | None
    merge_decimal_providers: Sequence[DecimalProviderDependentGet]
    next_decimal_providers: Sequence[DecimalProviderDependentGet]
    bank_account_fees_providers: Sequence[DependentGet]

def add_decimal_provider_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper.field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field(
            "merge_decimal_providers",
            AssociationModelField(
                association_field="merge_decimal_provider",
                get_mapper=decimal_provider_dependent_get_mapper,
            ),
        )
        .field(
            "next_decimal_providers",
            AssociationModelField(
                association_field="next_decimal_provider",
                get_mapper=decimal_provider_dependent_get_mapper,
            ),
        )
        .field(
            "bank_account_fees_providers",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
    )
