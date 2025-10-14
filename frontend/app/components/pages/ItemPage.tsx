import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {type RowData} from "~/components/controls/item_list/ItemList";
import {useCallback, useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {Box, Button, Group, LoadingOverlay, Space, Stack, TextInput, Title} from "@mantine/core";
import {useSearchParams} from "react-router";
import {type APIResult, callApi} from "~/lib/api_wrapper";

interface PutData {
    type?: string
    name: string
    description: string
}

interface ItemPageProps {
    itemId: string
    collectionLabel: string,
    itemTypes?: Record<string, string>
    getTitle: (itemId: string, itemName: string | null) => string
    getDescription: (itemId: string, itemName: string | null) => string
    getBreadcrumbs: (itemId: string, itemName: string | null) => { title: string, href: string }[]
    getItem: <T extends RowData>(itemId: string) => Promise<APIResult<T>>
    putItem: <T extends RowData>(itemId: string, data: PutData) => Promise<APIResult<T>>
}

export function ItemPage({
                             itemId,
                             collectionLabel,
                             itemTypes,
                             getTitle,
                             getDescription,
                             getBreadcrumbs,
                             getItem,
                             putItem,
                         }: ItemPageProps) {
    const capitalizedLabel = collectionLabel.replace(/^./, collectionLabel[0].toUpperCase())
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");
    const [_, setHeaderData] = useHeaderData();
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [item, setItem] = useState<RowData>()
    const [title, setTitle] = useState(getTitle(itemId, name))
    const [description, setDescription] = useState(getDescription(itemId, name))
    const [nameInputValue, setNameInputValue] = useState<string>("")
    const [descriptionInputValue, setDescriptionInputValue] = useState<string>("")
    const [typeIndicatorValue, setTypeIndicatorValue] = useState<string>()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    useEffect(() => {
        setHeaderData({
            title: getTitle(itemId, name),
            breadcrumbs: getBreadcrumbs(itemId, name),
        })
        callApi({
            api: () => getItem(itemId),
            errorTitle: "Get item error",
            onSuccess: setItem,
            startLoading,
            stopLoading,
        });
    }, []);

    useEffect(() => {
        if (item !== undefined) {
            const title = getTitle(itemId, item.name)
            const description = getDescription(itemId, item.name)
            const breadcrumbs = getBreadcrumbs(itemId, item.name)
            setTitle(title)
            setDescription(description)
            setHeaderData({
                title,
                breadcrumbs,
            });
            setNameInputValue(item.name)
            setDescriptionInputValue(item.description)
            if (itemTypes) {
                setTypeIndicatorValue(item.type)
            }
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            if (nameInputValue === item.name && descriptionInputValue === item.description) {
                setRevertDisabled(true);
                setSaveDisabled(true);
            } else {
                setRevertDisabled(false);
                if (nameInputValue.trim() === "") {
                    setSaveDisabled(true);
                } else {
                    setSaveDisabled(false);
                }
            }
        }
    }, [item, nameInputValue, descriptionInputValue])

    const revert = useCallback(() => {
        if (item) {
            setNameInputValue(item.name)
            setDescriptionInputValue(item.description)
        }
    }, [item])

    const save = useCallback(() => {
        if (item) {
            callApi({
                api: () => putItem(itemId, {
                    type: typeIndicatorValue,
                    name: nameInputValue,
                    description: descriptionInputValue,
                }),
                errorTitle: "Save item error",
                onSuccess: setItem,
                startLoading,
                stopLoading,
            });
        }
    }, [item, nameInputValue, descriptionInputValue, typeIndicatorValue])

    function TypeIndicator() {
        if (typeIndicatorValue && itemTypes) {
            return <Title order={4}>{itemTypes[typeIndicatorValue]}</Title>
        }
        return null
    }

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <Stack>
            <TypeIndicator/>
            <TextInput
                label="Name"
                placeholder="Name"
                description={`${capitalizedLabel} name`}
                value={nameInputValue}
                size="sm"
                required={true}
                onChange={(event) => setNameInputValue(event.currentTarget.value)}
            />
            <TextInput
                label="Description"
                placeholder="Description"
                description={`${capitalizedLabel} description`}
                value={descriptionInputValue}
                size="sm"
                onChange={(event) => setDescriptionInputValue(event.currentTarget.value)}
            />
            <Space h={20}/>
            <Group justify="flex-end">
                <Button onClick={revert} disabled={revertDisabled}>Revert</Button>
                <Button onClick={save} disabled={saveDisabled}>Save</Button>
            </Group>
        </Stack>
    </Box>
}
