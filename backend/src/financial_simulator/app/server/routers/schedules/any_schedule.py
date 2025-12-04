from typing import Literal, Sequence, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    AnySchedule,
    AnyScheduleSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    AssociationModelField,
    AssociationReference,
)
from .schedule import (
    ScheduleGet,
    SchedulePost,
    add_schedule_model_fields,
)
from financial_simulator.app.server.routers.schedules.schedule_dependent import (
    ScheduleDependentGet,
    schedule_dependent_get_mapper,
)
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class AnySchedulePost(SchedulePost):
    type: Literal[ScheduleType.ANY]
    schedules: Sequence[AssociationReference]


class AnyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.ANY]
    schedules: Sequence[ScheduleDependentGet]


any_schedule_model_mapper = ModelMapper(
    table_model=AnySchedule,
    get_model=AnyScheduleGet,
    post_model=AnySchedulePost,
)
(
    add_schedule_model_fields(any_schedule_model_mapper)
    .field("schedules", AssociationModelField(
        association_field="schedule",
        association_model=AnyScheduleSchedule,
        get_mapper=schedule_dependent_get_mapper,
    ))
)


class AnyScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return AnySchedule.name


router = APIRouter(
    prefix="/any-schedules",
    tags=["any-schedules"],
)


Collection(
    query_params_class=AnyScheduleQueryParams,
    model_mapper=any_schedule_model_mapper,
).add_endpoints(
    router=router,
)
