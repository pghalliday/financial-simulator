from typing import Sequence


from financial_simulator.app.server.util.model_mapper.simple.simple_get_mapper import SimpleGetMapper
from financial_simulator.app.server.util.model_mapper.model_mapper import (
    ModelMapper,
    TABLE,
    GET,
    POST,
    PATCH,
)
from financial_simulator.app.server.util.model_mapper.simple.simple_patch_mapper import SimplePatchMapper
from financial_simulator.app.server.util.model_mapper.simple.simple_post_mapper import SimplePostMapper


class SimpleModelMapper(ModelMapper[TABLE, GET, POST, PATCH]):
    def __init__(
            self,
            table_model: type[TABLE],
            get_model: type[GET],
            post_model: type[POST],
            patch_model: type[PATCH],
            fields: Sequence[str] = None,
            tree_children_fields: Sequence[str] = None,
            tree_parent_fields: Sequence[str] = None,
    ):
        if fields is None:
            fields = []
        if tree_children_fields is None:
            tree_children_fields = []
        if tree_parent_fields is None:
            tree_parent_fields = []
        super().__init__(
            table_model=table_model,
            get_model=get_model,
            post_model=post_model,
            patch_model=patch_model,
            has_invalid_relation_error=False,
            get_mapper=SimpleGetMapper(
                table_model=table_model,
                get_model=get_model,
                fields=fields,
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
            post_mapper=SimplePostMapper(
                table_model=table_model,
                post_model=post_model,
                fields=fields,
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
            patch_mapper=SimplePatchMapper(
                table_model=table_model,
                patch_model=patch_model,
                fields=fields,
                tree_children_fields=tree_children_fields,
                tree_parent_fields=tree_parent_fields,
            ),
        )
