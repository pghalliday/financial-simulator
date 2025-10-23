import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_PAGE_DESCRIPTION, PAGE_TITLE} from "~/strings";
import {type ItemPostFieldGetter, type ItemPostFieldSetter, useItemPost} from "~/lib/hooks/useItemPost";
import {useInitialItem} from "~/lib/hooks/useInitialItem";
import {useEffect, useState} from "react";
import {useItem} from "~/lib/hooks/useItem";
import type {GetItemApi, NamedItem, PutItemApi} from "~/lib/types";

export function useItemPage<ItemPost extends {}, ItemGet extends ItemPost & NamedItem>(
    getItemApi: GetItemApi<ItemGet>,
    putItemApi: PutItemApi<ItemPost, ItemGet>,
    itemId: string,
    collectionPageDescription: string,
    collectionHref: string,
    itemPageDescription: (item: NamedItem) => string,
    itemHref: (item: NamedItem) => string,
    startLoading: () => void,
    stopLoading: () => void,
    setRevertDisabled: (disabled: boolean) => void,
    setSaveDisabled: (disabled: boolean) => void,
    onValidate: (itemPost: Partial<ItemPost>) => ItemPost | undefined,
): {
    getField: ItemPostFieldGetter<ItemPost>,
    setField: ItemPostFieldSetter<ItemPost>,
    revert: () => void,
    submit: () => void,
    pageTitle: string,
    pageDescription: string,
    pageBreadcrumbs: { title: string, href: string }[],
} {
    const initialItem = useInitialItem(itemId)

    function createTitle(item: NamedItem): string {
        return PAGE_TITLE(itemPageDescription(item))
    }

    function createBreadcrumbs(item: NamedItem): { title: string, href: string }[] {
        return [
            {
                title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
                href: COMPARE_SCENARIOS_HREF,
            },
            {
                title: collectionPageDescription,
                href: collectionHref,
            },
            {
                title: item.name,
                href: itemHref(item),
            },
        ]
    }

    const [pageTitle, setPageTitle] = useState(createTitle(initialItem))
    const [pageDescription, setPageDescription] = useState(itemPageDescription(initialItem))
    const [pageBreadcrumbs, setPageBreadcrumbs] = useState(createBreadcrumbs(initialItem))

    const {item, putItem} = useItem(
        getItemApi,
        putItemApi,
        itemId,
        startLoading,
        stopLoading,
    )

    const {setItemPost, getField, setField, valid, modified, revert, submit} = useItemPost<ItemPost>(
        onValidate,
        putItem,
    )

    useEffect(() => {
        if (item !== undefined) {
            setPageTitle(createTitle(item))
            setPageDescription(itemPageDescription(item))
            setPageBreadcrumbs(createBreadcrumbs(item))
            setItemPost({...item})
        }
    }, [item]);

    useEffect(() => {
        setRevertDisabled(!modified)
        setSaveDisabled(!modified || !valid)
    }, [valid, modified]);

    return {
        getField,
        setField,
        revert,
        submit,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    }
}