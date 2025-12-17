import logging
from typing import Generic, Sequence

from financial_simulator.app.server.util.dependent_types import NamedDependentGet
from ...get_mapper import GetMapper
from ..get_field import GetField
from ...type_vars import (
    TABLE,
    GET,
    RELATED_TABLE,
    RELATED_GET,
)

logger = logging.getLogger(__name__)


class NamedAssociationGetField(GetField[TABLE, GET], Generic[TABLE, GET, RELATED_TABLE, RELATED_GET]):
    __association_field: str
    __get_mapper: GetMapper[RELATED_TABLE, RELATED_GET]

    def __init__(self, association_field: str, get_mapper: GetMapper[RELATED_TABLE, RELATED_GET]) -> None:
        self.__association_field = association_field
        self.__get_mapper = get_mapper

    def __map_named(self, named: RELATED_TABLE) -> RELATED_GET:
        return self.__get_mapper.map(named) if named is not None else None

    def map(self, field: str, item: TABLE) -> Sequence[NamedDependentGet]:
        return [NamedDependentGet(
            name=sub_item.name,
            value=self.__map_named(getattr(sub_item, self.__association_field)),
        ) for sub_item in getattr(item, field)]
