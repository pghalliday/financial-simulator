import {Box, LoadingOverlay} from "@mantine/core";
import {type PropsWithChildren} from "react";
import {PageMetaData, type PageParams} from "~/pages/common/PageMetaData";
import {useLoading} from "~/providers/LoadingProvider";

interface Props {
    pageParams: PageParams
}

export function Page(
    {
        pageParams,
        children,
    }: PropsWithChildren<Props>
) {
    const loading = useLoading()
    return <>
        <PageMetaData pageParams={pageParams}/>
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
