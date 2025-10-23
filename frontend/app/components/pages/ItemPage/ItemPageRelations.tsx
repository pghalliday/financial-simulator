import type {PropsWithChildren} from "react";
import {Stack} from "@mantine/core";

export function ItemPageRelations({children}: PropsWithChildren<{}>) {
    return <Stack>
        {children}
    </Stack>
}
