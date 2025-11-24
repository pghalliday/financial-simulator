from typing import Literal, Sequence

from financial_simulator.app.database.schema import (
    DecimalProviderType,
    NextDecimalProvider,
    NextDecimalProviderProvider,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationReference,
    AssociationModelField,
)
from .decimal_provider import DecimalProviderGet, DecimalProviderPost, add_decimal_provider_model_fields
from .decimal_provider_dependent import (
    DecimalProviderDependentGet,
    decimal_provider_dependent_get_mapper,
)


class NextDecimalProviderPost(DecimalProviderPost):
    type: Literal[DecimalProviderType.NEXT]
    decimal_providers: Sequence[AssociationReference]


class NextDecimalProviderGet(DecimalProviderGet):
    type: Literal[DecimalProviderType.NEXT]
    decimal_providers: Sequence[DecimalProviderDependentGet]


next_provider_model_mapper = ModelMapper(
    table_model=NextDecimalProvider,
    get_model=NextDecimalProviderGet,
    post_model=NextDecimalProviderPost,
)
(
    add_decimal_provider_model_fields(next_provider_model_mapper)
    .field("decimal_providers", AssociationModelField(
        association_field="decimal_provider",
        association_model=NextDecimalProviderProvider,
        get_mapper=decimal_provider_dependent_get_mapper,
    ))
)
