import type {NavbarLinkTree} from "~/components/layout/NavbarLink";
import type {Breadcrumb, KeysOfType} from "~/lib/types";
import type {ReactElement} from "react";
import {type ItemPageParams, PAGE_PARAMS_SEARCH_KEY} from "../hooks/useItemPageParams";
import {createSearchParams} from "react-router";

function createItemSuffix(itemPageParams: ItemPageParams): string {
    const names: string[] = []
    let parent: ItemPageParams | undefined = itemPageParams
    while (parent !== undefined) {
        names.unshift(parent.name)
        parent = parent.parent
    }
    return names.join(" - ")
}

function createItemBreadcrumbs(itemHref: (itemPageParams: ItemPageParams) => string, itemPageParams: ItemPageParams): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = []
    let parent: ItemPageParams | undefined = itemPageParams
    while (parent !== undefined) {
        breadcrumbs.unshift({
            title: parent.name,
            href: itemHref(parent),
        })
        parent = parent.parent
    }
    return breadcrumbs
}

export function createItemPageDescriptionFunction(prefix: string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => `${prefix} - ${createItemSuffix(itemPageParams)}`
}

export function createItemPageTitleFunction(itemPageDescription: (itemPageParams: ItemPageParams) => string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => PAGE_TITLE(itemPageDescription(itemPageParams))
}

export function createItemHrefFunction(rootHref: string): (itemPageParams: ItemPageParams) => string {
    return (itemPageParams: ItemPageParams) => `${rootHref}/${itemPageParams.id}?${createSearchParams({[PAGE_PARAMS_SEARCH_KEY]: JSON.stringify(itemPageParams)})}`
}

export function createItemBreadcrumbsFunction(prefix: Breadcrumb[], itemHref: (itemPageParams: ItemPageParams) => string): (itemPageParams: ItemPageParams) => Breadcrumb[] {
    return (itemPageParams: ItemPageParams) => prefix.concat(createItemBreadcrumbs(itemHref, itemPageParams))
}

export const APP_NAME = 'Financial Simulator';
export const PAGE_TITLE = (suffix: string) => `${APP_NAME} - ${suffix}`;
export const ADD_ITEM_MODAL_TITLE = (label: string) => `Add ${label}`
export const CONFIRM_DELETE_ITEM_MODAL_TITLE = (label: string) => `Confirm delete ${label}`
export const CONFIRM_DELETE_ITEM_MODAL_PROMPT = (label: string) => (name: string) => (
    <>
        Are you sure you want to delete {label}:
        <ul>
            <li><b>{name}</b></li>
        </ul>
    </>
)

export class PageParams<Get> implements NavbarLinkTree {
    public readonly collectionPageTitle: string
    public readonly collectionBreadcrumbs: Breadcrumb[]
    public readonly addItemModalTitle: string
    public readonly confirmDeleteItemModalTitle: string
    public readonly confirmDeleteItemModalPrompt: (item: Get) => ReactElement
    public readonly itemPageDescription: (itemPageParams: ItemPageParams) => string
    public readonly itemPageTitle: (itemPageParams: ItemPageParams) => string
    public readonly itemHref: (itemPageParams: ItemPageParams) => string
    public readonly itemBreadcrumbs: (itemPageParams: ItemPageParams) => Breadcrumb[]
    public readonly navbarLinkHref: string;
    public readonly navbarLinkLabel: string;

    constructor(
        public readonly collectionPageDescription: string,
        public readonly collectionHref: string,
        public readonly collectionLabel: string,
        itemPageDescriptionPrefix: string,
        nameField: KeysOfType<Get, string>,
        public readonly getItemPageParams: (item: Get) => ItemPageParams,
    ) {
        this.navbarLinkHref = collectionHref
        this.navbarLinkLabel = collectionPageDescription
        this.collectionPageTitle = PAGE_TITLE(collectionPageDescription);
        this.collectionBreadcrumbs = [
            {
                title: collectionPageDescription,
                href: collectionHref,
            },
        ];
        this.addItemModalTitle = ADD_ITEM_MODAL_TITLE(collectionLabel)
        this.confirmDeleteItemModalTitle = CONFIRM_DELETE_ITEM_MODAL_TITLE(collectionLabel)
        this.confirmDeleteItemModalPrompt = (item: Get) => CONFIRM_DELETE_ITEM_MODAL_PROMPT(collectionLabel)(item[nameField] as string)
        this.itemPageDescription = createItemPageDescriptionFunction(itemPageDescriptionPrefix)
        this.itemPageTitle = createItemPageTitleFunction(this.itemPageDescription);
        this.itemHref = createItemHrefFunction(collectionHref)
        this.itemBreadcrumbs = createItemBreadcrumbsFunction(this.collectionBreadcrumbs, this.itemHref)
    }
}