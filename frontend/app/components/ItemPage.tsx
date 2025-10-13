import {useHeaderData} from "~/components/HeaderDataProvider";
import {type Item} from "~/components/ItemList";
import {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {Box, LoadingOverlay} from "@mantine/core";
import type {APIItem} from "~/lib/api";

interface ItemPageProps {
    itemId: string
    getTitle: (itemId: string, item?: Item) => string
    getDescription: (itemId: string, item?: Item) => string
    getBreadcrumbs: (itemId: string, item?: Item) => { title: string, href: string }[]
    getItem: (itemId: string) => Promise<APIItem>
}

export function ItemPage({
                             itemId,
                             getTitle,
                             getDescription,
                             getBreadcrumbs,
                             getItem,
                         }: ItemPageProps) {
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [item, setItem] = useState<Item>()
    const [title, setTitle] = useState(getTitle(itemId))
    const [description, setDescription] = useState(getDescription(itemId))
    const [itemName, setItemName] = useState<string>()

    useEffect(() => {
        setHeaderData({
            title: getTitle(itemId),
            breadcrumbs: getBreadcrumbs(itemId),
        })
    }, []);

    useEffect(() => {
        startLoading()
        getItem(itemId).then(({data, error, response}) => {
            if (data != undefined) {
                setItem(data)
            } else {
                console.error(`${response.status}: ${response.statusText}: ${error}`)
            }
        }).finally(stopLoading)
    }, []);

    useEffect(() => {
        if (item !== undefined) {
            const title = getTitle(itemId, item)
            const description = getDescription(itemId, item)
            const breadcrumbs = getBreadcrumbs(itemId, item)
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
