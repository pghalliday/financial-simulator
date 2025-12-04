import {Box, LoadingOverlay} from "@mantine/core";
import {type PropsWithChildren} from "react";
import {PageMetaData, type PageMetaDataParams} from "~/pages/PageMetaData";
import {useLoading} from "~/providers/LoadingProvider";

interface Props {
    pageParams: PageMetaDataParams
}

export function Page(
    {
        pageParams,
        children,
    }: PropsWithChildren<Props>
) {
    const loading = useLoading()
    return <>
        <PageMetaData pageMetaDataParams={pageParams}/>
        <Box pos="relative">
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{blur: 2}}
            />
            {children}
        </Box>
    </>
}
