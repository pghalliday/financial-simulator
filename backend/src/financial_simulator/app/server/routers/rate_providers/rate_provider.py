from typing import Sequence
from uuid import UUID

from financial_simulator.app.database.schema import (
    RateProviderType,
)
from financial_simulator.app.server.routers.bank_accounts.bank_account_dependent import \
    bank_account_dependent_get_mapper
from financial_simulator.app.server.util.dependent import DependentGet
from financial_simulator.app.server.util.typed_collection import TypedBaseModel
from .rate_provider_dependent import rate_provider_dependent_get_mapper, RateProviderDependentGet
from financial_simulator.app.server.util.model_mapper import (
    OrdinaryModelField,
    AssociationModelField,
    ModelMapper,
    ChildrenModelField,
)


class RateProviderPost(TypedBaseModel[RateProviderType]):
    name: str
    description: str | None = None


class RateProviderGet(TypedBaseModel[RateProviderType]):
    id: UUID
    name: str
    description: str | None
    merge_rate_providers: Sequence[RateProviderDependentGet]
    next_rate_providers: Sequence[RateProviderDependentGet]
    bank_account_rate_providers: Sequence[DependentGet]

def add_rate_provider_model_fields(model_mapper: ModelMapper) -> ModelMapper:
    return (
        model_mapper.field("type", OrdinaryModelField())
        .field("name", OrdinaryModelField())
        .field("description", OrdinaryModelField())
        .field(
            "merge_rate_providers",
            AssociationModelField(
                association_field="merge_rate_provider",
                get_mapper=rate_provider_dependent_get_mapper,
            ),
        )
        .field(
            "next_rate_providers",
            AssociationModelField(
                association_field="next_rate_provider",
                get_mapper=rate_provider_dependent_get_mapper,
            ),
        )
        .field(
            "bank_account_rate_providers",
            ChildrenModelField(bank_account_dependent_get_mapper),
        )
    )
