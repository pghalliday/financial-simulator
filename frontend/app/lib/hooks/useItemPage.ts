import {type ItemPostFieldGetter, type ItemPostFieldSetter, useItemPost} from "~/lib/hooks/useItemPost";
import {type ItemPageParams, useItemPageParams} from "~/lib/hooks/useItemPageParams";
import {useEffect, useState} from "react";
import type {Breadcrumb, GetItemApi, IdItem, PutItemApi} from "~/lib/types";
import {useGetItem} from "~/lib/hooks/useGetItem";
import {usePutItem} from "~/lib/hooks/usePutItem";

export function useItemPage<ItemPost extends {}, ItemGet extends ItemPost & IdItem>(
    itemId: string,
    itemPageTitle: (itemPageParams: ItemPageParams) => string,
    itemPageDescription: (itemPageParams: ItemPageParams) => string,
    itemBreadcrumbs: (itemPageParams: ItemPageParams) => Breadcrumb[],
    getItemPageParams: (item: ItemGet) => ItemPageParams,
    getItemApi: GetItemApi<ItemGet>,
    putItemApi: PutItemApi<ItemPost, ItemGet>,
    startLoading: () => void,
    stopLoading: () => void,
    setRevertDisabled: (disabled: boolean) => void,
    setSaveDisabled: (disabled: boolean) => void,
    onValidate: (itemPost: Partial<ItemPost>) => ItemPost | undefined,
    depth: number = 0,
    maxParents: number = 0,
): {
    item: ItemGet | undefined,
    getField: ItemPostFieldGetter<ItemPost>,
    setField: ItemPostFieldSetter<ItemPost>,
    revert: () => void,
    submit: () => void,
    pageTitle: string,
    pageDescription: string,
    pageBreadcrumbs: { title: string, href: string }[],
} {
    const itemPageParams = useItemPageParams(itemId)

    const [pageTitle, setPageTitle] = useState(itemPageTitle(itemPageParams))
    const [pageDescription, setPageDescription] = useState(itemPageDescription(itemPageParams))
    const [pageBreadcrumbs, setPageBreadcrumbs] = useState(itemBreadcrumbs(itemPageParams))

    const {item, setItem} = useGetItem(
        itemId,
        getItemApi,
        startLoading,
        stopLoading,
        depth,
        maxParents,
    )

    const putItem = usePutItem(
        item,
        setItem,
        putItemApi,
        startLoading,
        stopLoading,
    )

    const {setItemPost, getField, setField, valid, modified, revert, submit} = useItemPost<ItemPost>(
        onValidate,
        putItem,
    )

    useEffect(() => {
        if (item !== undefined) {
            setPageTitle(itemPageTitle(getItemPageParams(item)))
            setPageDescription(itemPageDescription(getItemPageParams(item)))
            setPageBreadcrumbs(itemBreadcrumbs(getItemPageParams(item)))
            setItemPost({...item})
        }
    }, [item]);

    useEffect(() => {
        setRevertDisabled(!modified)
        setSaveDisabled(!modified || !valid)
    }, [valid, modified]);

    return {
        item,
        getField,
        setField,
        revert,
        submit,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    }
}