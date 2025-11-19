import logging
from dataclasses import replace
from typing import Sequence, Generic

from financial_simulator.app.server.util.model_mapper.fields.get_field import GetField
from financial_simulator.app.server.util.model_mapper.types import (
    TABLE,
    GET,
    GetMapperInterface,
    RELATED_TABLE,
    RELATED_GET,
    TreeBehavior,
)

logger = logging.getLogger(__name__)


class AssociationGetField(GetField[TABLE, GET], Generic[TABLE, GET, RELATED_TABLE, RELATED_GET]):
    __association_field: str
    __get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None

    def __init__(self, association_field: str, get_mapper: GetMapperInterface[RELATED_TABLE, RELATED_GET] | None = None) -> None:
        self.__association_field = association_field
        self.__get_mapper = get_mapper

    def map(self, field: str, item: TABLE, get_mapper: GetMapperInterface[TABLE, GET], tree_behavior: TreeBehavior) -> Sequence[GET]:
        get_mapper = self.__get_mapper or get_mapper
        return [] if tree_behavior.omit_children else [
            get_mapper.map(getattr(sub_item, self.__association_field), replace(tree_behavior, omit_parents=True)) for sub_item in getattr(item, field)
        ]
