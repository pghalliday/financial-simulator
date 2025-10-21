export const APP_NAME = 'Financial Simulator';
export const PAGE_TITLE = (name: string) => `${APP_NAME} - ${name}`;
export const COMPARE_SCENARIOS_PAGE_DESCRIPTION = 'Compare scenarios';
export const COMPARE_SCENARIOS_HREF = '/';
export const SCENARIOS_PAGE_DESCRIPTION = 'Scenarios';
export const SCENARIOS_HREF = '/scenarios';
export const SCENARIOS_LABEL = 'scenario';
export const ENTITIES_PAGE_DESCRIPTION = 'Entities';
export const ENTITIES_HREF = '/entities';
export const ENTITIES_LABEL = 'entity';
export const BANK_ACCOUNTS_PAGE_DESCRIPTION = 'Bank accounts';
export const BANK_ACCOUNTS_HREF = '/bank-accounts'
export const BANK_ACCOUNTS_LABEL = 'bank account'
export const SCENARIO_PAGE_DESCRIPTION = (scenarioName: string) => `Scenario - ${scenarioName}`;
export const SCENARIO_HREF = (scenarioId: string) => `${SCENARIOS_HREF}/${scenarioId}`;
export const ENTITY_PAGE_DESCRIPTION = (entityName: string) => `Entity - ${entityName}`;
export const ENTITY_HREF = (entityId: string) => `${ENTITIES_HREF}/${entityId}`;
export const ENTITY_TYPES = {
    "individual_entity": "Individual",
    "corporation_entity": "Corporation",
}
export const BANK_ACCOUNT_PAGE_DESCRIPTION = (bankAccountName: string) => `Bank account - ${bankAccountName}`;
export const BANK_ACCOUNT_HREF = (bankAccountId: string) => `${BANK_ACCOUNTS_HREF}/${bankAccountId}`;
