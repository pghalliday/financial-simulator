import {useDisclosure} from '@mantine/hooks';
import {Button, Modal, Space, TextInput, useModalsStack} from '@mantine/core';
import {Page} from "~/pages/common/Page";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {useForm} from "@mantine/form";

export default function Playground() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure();
    const stack = useModalsStack(["test1", "test2"])
    const form1 = useForm({
        mode: "uncontrolled",
        initialValues: {
            first: "hello",
            second: "world",
        },
    })
    const form2 = useForm({
        mode: "uncontrolled",
        initialValues: {
            third: "apple",
            fourth: "banana",
        },
    })

    return (
        <LoadingProvider loading={loading}>
            <Page pageParams={{
                title: "Playground",
                description: "Playground",
                breadcrumbs: [],
            }}>
                <Modal.Stack>
                    <Modal
                        {...stack.register("test1")}
                        title="Focus demo"
                    >
                        <TextInput
                            label="First input"
                            key={form1.key("first")}
                            {...form1.getInputProps("first")}
                        />
                        <TextInput
                            // data-autofocus
                            label="Second input"
                            mt="md"
                            key={form1.key("second")}
                            {...form1.getInputProps("second")}
                        />
                        <Space h={20}/>
                        <Button variant="default" onClick={() => {
                            console.log(document.activeElement)
                            console.log(form1.getInputNode("second"))
                            stack.open("test2")
                        }}>
                            Open next modal
                        </Button>
                    </Modal>
                    <Modal
                        {...stack.register("test2")}
                        title="Focus demo"
                    >
                        <TextInput
                            label="Third input"
                            key={form2.key("third")}
                            {...form2.getInputProps("third")}
                        />
                        <TextInput
                            // data-autofocus
                            label="Fourth input"
                            mt="md"
                            key={form2.key("fourth")}
                            {...form2.getInputProps("fourth")}
                        />
                    </Modal>
                </Modal.Stack>

                <Button variant="default" onClick={() => {
                    stack.open("test1")
                    console.log(form1.getInputNode("second"))
                    form1.getInputNode("second")?.focus()
                }}>
                    Open modal
                </Button>
            </Page>
        </LoadingProvider>
    );
}
