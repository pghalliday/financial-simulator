from typing import Sequence
from uuid import UUID


from financial_simulator.app.database.schema.provider.provider_type import ProviderType
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.routers.common.dependent import DependentGet
from financial_simulator.app.server.routers.common.typed_collection import TypedBaseModel
from financial_simulator.app.server.routers.providers.provider_dependent import ProviderDependentGet, \
    provider_dependent_get_mapper
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    AssociationModelField,
    ModelMapper,
    ChildrenModelField,
)


class ProviderPost(TypedBaseModel[ProviderType]):
    name: str
    description: str | None = None


class ProviderGet(TypedBaseModel[ProviderType]):
    id: UUID
    name: str
    description: str | None
    merge_providers: Sequence[ProviderDependentGet]
    next_providers: Sequence[ProviderDependentGet]
    bank_account_fees_providers: Sequence[DependentGet]
    bank_account_rate_providers: Sequence[DependentGet]

def add_provider_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper.field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field(
            "merge_providers",
            AssociationModelField(
                association_field="merge_provider",
                get_mapper=provider_dependent_get_mapper,
            ),
        )
        .field(
            "next_providers",
            AssociationModelField(
                association_field="next_provider",
                get_mapper=provider_dependent_get_mapper,
            ),
        )
        .field(
            "bank_account_fees_providers",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
        .field(
            "bank_account_rate_providers",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
    )
