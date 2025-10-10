from enum import StrEnum
from urllib.parse import urljoin

from financial_simulator.app.dashboard.aio import (
    ListItemType,
)

APPSHELL_ID = "appshell"
NAVBAR_ID = "navbar"
HEADER_BREADCRUMBS_ID = "header-breadcrumbs"
HEADER_TITLE_ID = "header-title"
BURGER_ID = "burger"
LOCATION_ID = "location"
COMPARE_SCENARIOS_SCENARIO_SELECTOR_ID = "compare-scenarios-scenario-selector"
SCENARIOS_LIST_ID = "scenarios"
ENTITIES_LIST_ID = "entities"

NAV_LINK_TYPE = "nav-link"
LIST_TYPE = "list"
LIST_ADD_ITEM_POPUP_TYPE = "list-add-item-popup"
LIST_CONFIRM_DELETE_ITEM_POPUP_TYPE = "list-confirm-delete-item-popup"

SCENARIO_LABEL = "scenario"
ENTITIES_LABEL = "entity"

COMPARE_SCENARIOS_NAME = "Compare scenarios"
SCENARIOS_NAME = "Scenarios"
SCENARIO_NAME = "Scenario"
ENTITIES_NAME = "Entities"
ENTITY_NAME = "Entity"


class EntityType(StrEnum):
    INDIVIDUAL = "individual_entity"
    CORPORATION = "corporation_entity"


ENTITY_TYPES = [
    ListItemType(value=EntityType.INDIVIDUAL, label="Individual"),
    ListItemType(value=EntityType.CORPORATION, label="Corporation"),
]


def get_entity_type(value: EntityType) -> ListItemType:
    return next(
        entity_type for entity_type in ENTITY_TYPES if entity_type.value == value
    )


COMPARE_SCENARIOS_HREF = "/"

SCENARIOS_HREF = "/scenarios"
SCENARIO_ROOT_HREF = f"{SCENARIOS_HREF}/"
SCENARIO_HREF_TEMPLATE = f"{SCENARIO_ROOT_HREF}<scenario_id>"
SCENARIO_HREF_REGEX = rf"{SCENARIO_ROOT_HREF}([^/]+)"


def get_scenario_href(scenario_id: str) -> str:
    return urljoin(SCENARIO_ROOT_HREF, scenario_id)


ENTITIES_HREF = "/entities"
ENTITY_ROOT_HREF = f"{ENTITIES_HREF}/"
ENTITY_HREF_TEMPLATE = f"{ENTITY_ROOT_HREF}<entity_id>"
ENTITY_HREF_REGEX = rf"{ENTITY_ROOT_HREF}([^/]+)"


def get_entity_href(entity_id: str) -> str:
    return urljoin(ENTITY_ROOT_HREF, entity_id)
