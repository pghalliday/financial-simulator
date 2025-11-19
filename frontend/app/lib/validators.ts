import type {
    BankAccountPost,
    CorporationEntityPost,
    IndividualEntityPost,
    LedgerAccountPost,
    ScenarioPost
} from "../../client";

export function isValidScenarioPost(post: Partial<ScenarioPost>): post is ScenarioPost {
    return (
        post.name !== undefined &&
        post.description !== undefined &&
        post.name !== ""
    )
}

export function validateScenarioPost(post: Partial<ScenarioPost>): ScenarioPost | undefined {
    return isValidScenarioPost(post) ? post : undefined
}

export function isValidIndividualEntityPost(post: Partial<IndividualEntityPost>): post is IndividualEntityPost {
    return (
        post.type === "individual_entity" &&
        post.name !== undefined &&
        post.description !== undefined &&
        post.name !== ""
    )
}

export function validateIndividualEntityPost(post: Partial<IndividualEntityPost>): IndividualEntityPost | undefined {
    return isValidIndividualEntityPost(post) ? post : undefined
}

export function isValidCorporationEntityPost(post: Partial<CorporationEntityPost>): post is CorporationEntityPost {
    return (
        post.type === "corporation_entity" &&
        post.name !== undefined &&
        post.description !== undefined &&
        post.name !== ""
    )
}

export function validateCorporationEntityPost(post: Partial<CorporationEntityPost>): CorporationEntityPost | undefined {
    return isValidCorporationEntityPost(post) ? post : undefined
}

export function isValidEntityPost(post: Partial<IndividualEntityPost | CorporationEntityPost>): post is IndividualEntityPost | CorporationEntityPost {
    return (
        (post.type === "individual_entity" && isValidIndividualEntityPost(post)) ||
        (post.type === "corporation_entity" && isValidCorporationEntityPost(post))
    )
}

export function validateEntityPost(post: Partial<IndividualEntityPost | CorporationEntityPost>): IndividualEntityPost | CorporationEntityPost | undefined {
    return isValidEntityPost(post) ? post : undefined
}

export function isValidBankAccountPost(post: Partial<BankAccountPost>): post is BankAccountPost {
    return (
        post.name !== undefined &&
        post.description !== undefined &&
        post.asset_account_id !== undefined &&
        post.interest_income_account_id != undefined &&
        post.interest_receivable_account_id != undefined &&
        post.fee_expenses_account_id != undefined &&
        post.fees_payable_account_id != undefined &&
        post.name !== ""
    )
}

export function validateBankAccountPost(post: Partial<BankAccountPost>): BankAccountPost | undefined {
    return isValidBankAccountPost(post) ? post : undefined
}

export function isValidLedgerAccountPost(post: Partial<LedgerAccountPost>): post is LedgerAccountPost {
    return (
        post.name !== undefined &&
        post.account_name !== undefined &&
        post.description !== undefined &&
        post.name !== "" &&
        post.account_name !== ""
    )
}

export function validateLedgerAccountPost(post: Partial<LedgerAccountPost>): LedgerAccountPost | undefined {
    return isValidLedgerAccountPost(post) ? post : undefined
}
