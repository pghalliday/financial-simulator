import logging
from typing import Union

from fastapi import APIRouter
from sqlalchemy import ColumnElement
from sqlalchemy.orm import InstrumentedAttribute

from financial_simulator.app.database.schema import (
    ScheduleType,
    Schedule,
)

from financial_simulator.app.server.util.typed_collection import TypedCollection
from .all_schedule import AllScheduleGet, AllSchedulePost, all_schedule_model_mapper
from .any_schedule import AnyScheduleGet, AnySchedulePost, any_schedule_model_mapper
from .daily_schedule import (
    daily_schedule_model_mapper,
    DailyScheduleGet,
    DailySchedulePost,
)
from .day_schedule import (
    day_schedule_model_mapper,
    DayScheduleGet,
    DaySchedulePost,
)
from .from_schedule import (
    from_schedule_model_mapper,
    FromScheduleGet,
    FromSchedulePost,
)
from .monthly_schedule import (
    MonthlyScheduleGet,
    MonthlySchedulePost,
    monthly_schedule_model_mapper,
)
from .until_schedule import (
    until_schedule_model_mapper,
    UntilScheduleGet,
    UntilSchedulePost,
)
from .range_schedule import (
    range_schedule_model_mapper,
    RangeScheduleGet,
    RangeSchedulePost,
)
from .weekly_schedule import (
    WeeklyScheduleGet,
    WeeklySchedulePost,
    weekly_schedule_model_mapper,
)
from .yearly_schedule import (
    YearlyScheduleGet,
    YearlySchedulePost,
    yearly_schedule_model_mapper,
)
from ...util.query_params import DefaultQueryParams

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
)


class ScheduleQueryParams(DefaultQueryParams):
    type: ScheduleType | None = None

    def query_order_by(self) -> Union[InstrumentedAttribute[str], None]:
        return Schedule.name

    def query_where(self) -> Union[ColumnElement[bool], None]:
        if self.type is None:
            return None
        return Schedule.type == self.type


TypedCollection(
    table_model=Schedule,
    query_params_class=ScheduleQueryParams,
    get_model=Union[
        DailyScheduleGet,
        DayScheduleGet,
        YearlyScheduleGet,
        MonthlyScheduleGet,
        WeeklyScheduleGet,
        FromScheduleGet,
        UntilScheduleGet,
        RangeScheduleGet,
        AllScheduleGet,
        AnyScheduleGet,
    ],
    post_model=Union[
        DailySchedulePost,
        DaySchedulePost,
        YearlySchedulePost,
        MonthlySchedulePost,
        WeeklySchedulePost,
        FromSchedulePost,
        UntilSchedulePost,
        RangeSchedulePost,
        AllSchedulePost,
        AnySchedulePost,
    ],
    model_mappers={
        ScheduleType.DAILY: daily_schedule_model_mapper,
        ScheduleType.DAY: day_schedule_model_mapper,
        ScheduleType.YEARLY: yearly_schedule_model_mapper,
        ScheduleType.MONTHLY: monthly_schedule_model_mapper,
        ScheduleType.WEEKLY: weekly_schedule_model_mapper,
        ScheduleType.FROM: from_schedule_model_mapper,
        ScheduleType.UNTIL: until_schedule_model_mapper,
        ScheduleType.RANGE: range_schedule_model_mapper,
        ScheduleType.ALL: all_schedule_model_mapper,
        ScheduleType.ANY: any_schedule_model_mapper,
    },
).add_endpoints(
    router=router,
)
