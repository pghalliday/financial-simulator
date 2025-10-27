from typing import Sequence, Mapping, TypeVar


from financial_simulator.app.database.schema import BaseWithId
from financial_simulator.app.server.util.model_mapper.related.field_relation import FieldRelation
from financial_simulator.app.server.util.model_mapper.related.related_get_mapper import RelatedGetMapper
from financial_simulator.app.server.util.model_mapper.model_mapper import (
    ModelMapper,
    TABLE,
    GET,
    POST,
    PATCH,
)
from financial_simulator.app.server.util.model_mapper.related.related_patch_mapper import RelatedPatchMapper
from financial_simulator.app.server.util.model_mapper.related.related_post_mapper import RelatedPostMapper

RELATED_TABLE = TypeVar("RELATED_TABLE", bound=BaseWithId)


class RelatedModelMapper(ModelMapper[TABLE, GET, POST, PATCH]):
    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
            patch_model: type[PATCH],
            ordinary_fields: Sequence[str] = None,
            related_fields: Mapping[str, FieldRelation] = None,
            optional_related_fields: Mapping[str, FieldRelation] =  None,
            tree_children_fields: Sequence[str] = None,
            tree_parent_fields: Sequence[str] = None,
    ):
        if ordinary_fields is None:
            ordinary_fields = []
        if related_fields is None:
            related_fields = {}
        if optional_related_fields is None:
            optional_related_fields = {}
        if tree_parent_fields is None:
            tree_parent_fields = []
        if tree_children_fields is None:
            tree_children_fields = []
        super().__init__(
            table_model=table_model,
            get_model=get_model,
            post_model=post_model,
            patch_model=patch_model,
            has_invalid_relation_error=len(related_fields.keys()) > 0 or len(optional_related_fields.keys()) > 0,
            get_mapper=RelatedGetMapper(
                table_model=table_model,
                get_model=get_model,
                fields=[
                    *ordinary_fields,
                    *related_fields.keys(),
                    *optional_related_fields.keys(),
                ],
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
            post_mapper=RelatedPostMapper(
                table_model=table_model,
                post_model=post_model,
                ordinary_fields=ordinary_fields,
                related_fields=related_fields,
                optional_related_fields=optional_related_fields,
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
            patch_mapper=RelatedPatchMapper(
                table_model=table_model,
                patch_model=patch_model,
                ordinary_fields=ordinary_fields,
                related_fields=related_fields,
                optional_related_fields=optional_related_fields,
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
        )
