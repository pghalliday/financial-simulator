from typing import Literal, Union

from fastapi import APIRouter
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import YearlySchedule, ScheduleType
from financial_simulator.app.server.util.model_mapper import (
    ModelMapper,
    OrdinaryModelField
)
from .schedule import ScheduleGet, SchedulePost, add_schedule_model_fields
from ...util.collection import Collection
from ...util.query_params import DefaultQueryParams


class YearlySchedulePost(SchedulePost):
    type: Literal[ScheduleType.YEARLY]
    month: int | None = None
    day: int | None = None


class YearlyScheduleGet(ScheduleGet):
    type: Literal[ScheduleType.YEARLY]
    month: int | None
    day: int | None


yearly_schedule_model_mapper = ModelMapper(
    table_model=YearlySchedule,
    get_model=YearlyScheduleGet,
    post_model=YearlySchedulePost,
)
(
    add_schedule_model_fields(yearly_schedule_model_mapper)
    .field("month", OrdinaryModelField())
    .field("day", OrdinaryModelField())
)


class YearlyScheduleQueryParams(DefaultQueryParams):
    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return YearlySchedule.name


router = APIRouter(
    prefix="/yearly-schedules",
    tags=["yearly-schedules"],
)


Collection(
    query_params_class=YearlyScheduleQueryParams,
    model_mapper=yearly_schedule_model_mapper,
).add_endpoints(
    router=router,
)
