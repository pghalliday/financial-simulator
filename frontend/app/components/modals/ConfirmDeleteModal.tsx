import {Blockquote, Button, Group, List, LoadingOverlay, Modal, Space, Stack, Text, Title} from "@mantine/core";
import {IconAlertHexagon, IconAlertTriangle} from "@tabler/icons-react";
import type {ReactElement} from "react";

export type ImpactSection = Record<string, string>
export type Impact = Record<string, ImpactSection>

export function ConfirmDeleteModal(
    {
        opened,
        working,
        onConfirm,
        onCancel,
        title,
        prompt,
        dependents,
        references,
    }: {
        opened: boolean,
        working: boolean,
        onConfirm: () => void,
        onCancel: () => void,
        title: string,
        prompt: ReactElement,
        dependents: Impact,
        references: Impact,
    }
) {
    function Item({keyPrefix, id, name}: { keyPrefix: string, id: string, name: string }) {
        return <List.Item key={keyPrefix + id}>{name}</List.Item>
    }

    function Section({keyPrefix, name, section}: { keyPrefix: string, name: string, section: ImpactSection }) {
        const items = Object.keys(section)
        if (items.length > 0) {
            return <List.Item key={keyPrefix + name}>
                {name}
                <List withPadding listStyleType="disc">
                    {items.map(id => (
                        <Item keyPrefix={keyPrefix} id={id} name={section[id]}/>
                    ))}
                </List>
            </List.Item>
        }
        return null
    }

    function Dependents() {
        const sections = Object.keys(dependents)
        if (sections.length > 0) {
            const icon = <IconAlertHexagon/>
            return <Blockquote color="red" key="dependents" icon={icon}>
                <Stack>
                    <Text fw={700}>If confirmed, the following items will also be deleted</Text>
                    <List listStyleType="disc">
                        {sections.map(section => (
                            <Section keyPrefix="dependents - " name={section} section={dependents[section]}/>
                        ))}
                    </List>
                </Stack>
            </Blockquote>
        }
        return null
    }

    function References() {
        const sections = Object.keys(references)
        if (sections.length > 0) {
            const icon = <IconAlertTriangle/>
            return <Blockquote color="yellow" key="references" icon={icon}>
                <Stack>
                    <Text fw={700}>If confirmed, the following items will lose a reference to this item</Text>
                    <List listStyleType="disc">
                        {sections.map(section => (
                            <Section keyPrefix="references - " name={section} section={references[section]}/>
                        ))}
                    </List>
                </Stack>
            </Blockquote>
        }
        return null
    }

    return <Modal
        opened={opened}
        onClose={onCancel}
        title={<Title order={4}>{title}</Title>}
    >
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <Stack gap={0}>
            {prompt}
            <Dependents/>
            <References/>
        </Stack>
        <Space h={10}/>
        <Group justify="flex-end">
            <Button
                onClick={onConfirm}
            >Delete</Button>
            <Button
                color="red"
                variant="outline"
                onClick={onCancel}
            >Cancel</Button>
        </Group>
    </Modal>
}
