export const APP_NAME = 'Financial Simulator';
export const PAGE_TITLE = (name: string) => `${APP_NAME} - ${name}`;
export const COMPARE_SCENARIOS_PAGE_DESCRIPTION = 'Compare scenarios';
export const COMPARE_SCENARIOS_HREF = '/';
export const SCENARIOS_PAGE_DESCRIPTION = 'Scenarios';
export const SCENARIOS_HREF = '/scenarios';
export const ENTITIES_PAGE_DESCRIPTION = 'Entities';
export const ENTITIES_HREF = '/entities';
export const SCENARIO_PAGE_DESCRIPTION = (scenarioName: string) => `Scenario - ${scenarioName}`;
export const SCENARIO_HREF = (scenarioId: string) => `${SCENARIOS_HREF}/${scenarioId}`;
export const ENTITY_PAGE_DESCRIPTION = (entityName: string) => `Entity - ${entityName}`;
export const ENTITY_HREF = (entityId: string) => `${ENTITIES_HREF}/${entityId}`;
export const ENTITY_TYPES = {
    "individual_entity": "Individual",
    "corporation_entity": "Corporation",
}
