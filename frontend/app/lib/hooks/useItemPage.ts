import {COMPARE_SCENARIOS_HREF, COMPARE_SCENARIOS_PAGE_DESCRIPTION, PAGE_TITLE, PUT_ITEM_ERROR_TITLE} from "~/strings";
import {callApi} from "~/lib/callApi";
import {type ItemPostFieldGetter, type ItemPostFieldSetter, useItemPost} from "~/lib/hooks/useItemPost";
import {useInitialItem} from "~/lib/hooks/useInitialItem";
import {useCallback, useEffect, useState} from "react";
import {useItem} from "~/lib/hooks/useItem";
import _ from "lodash";
import type {GetItemApi, NamedItem, PutApi} from "~/lib/types";

export function useItemPage<ItemPost extends {}, ItemGet extends ItemPost & NamedItem>(
    getItemApi: GetItemApi<ItemGet>,
    putItemApi: PutApi<ItemPost, ItemGet>,
    itemId: string,
    collectionPageDescription: string,
    collectionHref: string,
    itemPageDescription: (item: NamedItem) => string,
    itemHref: (item: NamedItem) => string,
    startLoading: () => void,
    stopLoading: () => void,
    setRevertDisabled: (disabled: boolean) => void,
    setSaveDisabled: (disabled: boolean) => void,
    validateItemPost: (itemPost: ItemPost) => boolean,
): {
    setItemPostField: ItemPostFieldSetter<ItemPost>,
    getItemPostField: ItemPostFieldGetter<ItemPost>,
    revert: () => void,
    save: () => void,
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

    const [itemGet, setItemGet] = useItem(
        getItemApi,
        itemId,
        startLoading,
        stopLoading,
    )

    const {itemPost, setItemPost, getItemPostField, setItemPostField} = useItemPost<ItemPost>()

    useEffect(() => {
        if (itemGet !== undefined) {
            setPageTitle(createTitle(itemGet))
            setPageDescription(itemPageDescription(itemGet))
            setPageBreadcrumbs(createBreadcrumbs(itemGet))
            setItemPost({...itemGet})
        }
    }, [itemGet]);

    useEffect(() => {
        if (itemPost !== undefined) {
            setRevertDisabled(_.isEqual(itemPost, itemGet))
            setSaveDisabled((_.isEqual(itemPost, itemGet)) || !validateItemPost(itemPost))
        } else {
            setRevertDisabled(true)
            setSaveDisabled(true)
        }
    }, [itemPost]);

    const revert = useCallback(() => {
        if (itemGet != undefined) {
            setItemPost({...itemGet})
        }
    }, [itemGet])

    const save = useCallback(() => {
        if (itemPost != undefined) {
            callApi({
                api: () => putItemApi({
                    path: {
                        item_id: itemId,
                    },
                    body: itemPost
                }),
                errorTitle: PUT_ITEM_ERROR_TITLE,
                onSuccess: setItemGet,
                startLoading,
                stopLoading,
            });
        }
    }, [itemPost])

    return {
        getItemPostField,
        setItemPostField,
        revert,
        save,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    }
}