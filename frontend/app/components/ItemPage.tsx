import {useHeaderData} from "~/components/HeaderDataProvider";
import {type Item} from "~/components/ItemList";
import {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {Box, LoadingOverlay} from "@mantine/core";
import type {APIItem} from "~/lib/api";
import {notifyError} from "~/lib/errors";
import {useSearchParams} from "react-router";

interface ItemPageProps {
    itemId: string
    getTitle: (itemId: string, itemName: string | null) => string
    getDescription: (itemId: string, itemName: string | null) => string
    getBreadcrumbs: (itemId: string, itemName: string | null) => { title: string, href: string }[]
    getItem: (itemId: string) => Promise<APIItem>
}

export function ItemPage({
                             itemId,
                             getTitle,
                             getDescription,
                             getBreadcrumbs,
                             getItem,
                         }: ItemPageProps) {
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [item, setItem] = useState<Item>()
    const [title, setTitle] = useState(getTitle(itemId, name))
    const [description, setDescription] = useState(getDescription(itemId, name))
    const [itemName, setItemName] = useState<string>()

    useEffect(() => {
        setHeaderData({
            title: getTitle(itemId, name),
            breadcrumbs: getBreadcrumbs(itemId, name),
        })
    }, []);

    useEffect(() => {
        startLoading()
        getItem(itemId).then(({data, error, response}) => {
            if (data != undefined) {
                setItem(data)
            } else {
                notifyError('Get item error', response, error)
            }
        }).finally(stopLoading)
    }, []);

    useEffect(() => {
        if (item !== undefined) {
            const title = getTitle(itemId, item.name)
            const description = getDescription(itemId, item.name)
            const breadcrumbs = getBreadcrumbs(itemId, item.name)
            setItemName(item.name)
            setTitle(title)
            setDescription(description)
            setHeaderData({
                title,
                breadcrumbs,
            });
        }
    }, [item]);

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        {itemName}
    </Box>
}
