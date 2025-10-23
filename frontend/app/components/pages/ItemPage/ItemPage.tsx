import {Box, LoadingOverlay} from "@mantine/core";
import {type PropsWithChildren, useEffect} from "react";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";

interface ItemPageProps {
    title: string
    description: string
    breadcrumbs: { title: string, href: string }[]
    loading: boolean
}

export function ItemPage({
                             title,
                             description,
                             breadcrumbs,
                             loading,
                             children,
                         }: PropsWithChildren<ItemPageProps>) {
    const [_, setHeaderData] = useHeaderData();

    useEffect(() => {
        setHeaderData({
            title: title,
            breadcrumbs: breadcrumbs,
        })
    }, []);

    return <Box pos="relative">
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        {children}
    </Box>
}
