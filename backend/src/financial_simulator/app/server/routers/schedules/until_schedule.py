from datetime import date
from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    UntilSchedule,
    ScheduleType,
)
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField,
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class UntilSchedulePost(SchedulePost):
    type: Literal[ScheduleType.UNTIL]
    until_date: date | None = None


class UntilScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.UNTIL]
    until_date: date | None


until_schedule_model_mapper = ModelMapper(
    table_model=UntilSchedule,
    get_model=UntilScheduleGet,
    post_model=UntilSchedulePost,
)
(
    add_schedule_model_fields(until_schedule_model_mapper)
    .field("until_date", OrdinaryModelField())
)


class UntilScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return UntilSchedule.name


router = APIRouter(
    prefix="/until-schedules",
    tags=["until-schedules"],
)


Collection(
    query_params_class=UntilScheduleQueryParams,
    model_mapper=until_schedule_model_mapper,
).add_endpoints(
    router=router,
)
