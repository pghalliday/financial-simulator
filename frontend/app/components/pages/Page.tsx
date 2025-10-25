import {Box, LoadingOverlay} from "@mantine/core";
import {type PropsWithChildren, useEffect} from "react";
import {useHeaderData} from "~/components/providers/HeaderDataProvider";

interface PageProps {
    title: string
    description: string
    breadcrumbs: { title: string, href: string }[]
    loading: boolean
}

export function Page({
                         title,
                         description,
                         breadcrumbs,
                         loading,
                         children,
                     }: PropsWithChildren<PageProps>) {
    const [_, setHeaderData] = useHeaderData();

    useEffect(() => {
        setHeaderData({
            title: title,
            breadcrumbs: breadcrumbs,
        })
    }, [title, breadcrumbs]);

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
