import {PageParams} from "./PageParams";
import type {
    AllScheduleGet,
    AnyScheduleGet,
    DailyScheduleGet,
    DayScheduleGet,
    FromScheduleGet,
    MonthlyScheduleGet,
    RangeScheduleGet,
    UntilScheduleGet,
    WeeklyScheduleGet,
    YearlyScheduleGet
} from "../../client";
import type {NavbarLinkTree} from "~/components/layout/NavbarLink";

export const SCHEDULES_HREF = '/schedule';
export const SCHEDULES_PAGE_DESCRIPTION = 'Schedules';

export const DAILY_SCHEDULE_PARAMS = new PageParams<DailyScheduleGet>(
    "Daily schedules",
    SCHEDULES_HREF + "/daily",
    "daily schedule",
    "Daily Schedule",
    "name",
    (item: DailyScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const DAY_SCHEDULE_PARAMS = new PageParams<DayScheduleGet>(
    "Day schedules",
    SCHEDULES_HREF + "/day",
    "day schedule",
    "Day Schedule",
    "name",
    (item: DayScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const WEEKLY_SCHEDULE_PARAMS = new PageParams<WeeklyScheduleGet>(
    "Weekly schedules",
    SCHEDULES_HREF + "/weekly",
    "weekly schedule",
    "Weekly Schedule",
    "name",
    (item: WeeklyScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const MONTHLY_SCHEDULE_PARAMS = new PageParams<MonthlyScheduleGet>(
    "Monthly schedules",
    SCHEDULES_HREF + "/monthly",
    "monthly schedule",
    "Monthly Schedule",
    "name",
    (item: MonthlyScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const YEARLY_SCHEDULE_PARAMS = new PageParams<YearlyScheduleGet>(
    "Yearly schedules",
    SCHEDULES_HREF + "/yearly",
    "yearly schedule",
    "Yearly Schedule",
    "name",
    (item: YearlyScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const FROM_SCHEDULE_PARAMS = new PageParams<FromScheduleGet>(
    "From schedules",
    SCHEDULES_HREF + "/from",
    "from schedule",
    "From Schedule",
    "name",
    (item: FromScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const UNTIL_SCHEDULE_PARAMS = new PageParams<UntilScheduleGet>(
    "Until schedules",
    SCHEDULES_HREF + "/until",
    "until schedule",
    "Until Schedule",
    "name",
    (item: UntilScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const RANGE_SCHEDULE_PARAMS = new PageParams<RangeScheduleGet>(
    "Range schedules",
    SCHEDULES_HREF + "/range",
    "range schedule",
    "Range Schedule",
    "name",
    (item: RangeScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const ANY_SCHEDULE_PARAMS = new PageParams<AnyScheduleGet>(
    "Any schedules",
    SCHEDULES_HREF + "/any",
    "any schedule",
    "Any Schedule",
    "name",
    (item: AnyScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const ALL_SCHEDULE_PARAMS = new PageParams<AllScheduleGet>(
    "All schedules",
    SCHEDULES_HREF + "/all",
    "all schedule",
    "All Schedule",
    "name",
    (item: AllScheduleGet) => ({
        id: item.id,
        name: item.name,
    }),
)

export const SCHEDULES_NAVBAR_LINK_TREE: NavbarLinkTree = {
    navbarLinkHref: SCHEDULES_HREF,
    navbarLinkLabel: SCHEDULES_PAGE_DESCRIPTION,
    navbarLinkChildren: [
        DAILY_SCHEDULE_PARAMS,
        DAY_SCHEDULE_PARAMS,
        WEEKLY_SCHEDULE_PARAMS,
        MONTHLY_SCHEDULE_PARAMS,
        YEARLY_SCHEDULE_PARAMS,
        FROM_SCHEDULE_PARAMS,
        UNTIL_SCHEDULE_PARAMS,
        RANGE_SCHEDULE_PARAMS,
        ALL_SCHEDULE_PARAMS,
        ANY_SCHEDULE_PARAMS,
    ]
}
