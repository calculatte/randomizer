<script lang="ts">
    import { Modal, Stack, TextArea, TextInput } from "carbon-components-svelte";
    import { manager, isPartitionModalOpen } from "./shared.svelte";
    import { config } from "$lib/config.svelte.js";

    let name: string = $state("");
    let description: string = $state("");

    function handleSubmit() {
        if ($manager.course == null) {
            $isPartitionModalOpen = false;
            return;
        }

        $manager.course.addPartition(name, description);
        $isPartitionModalOpen = false;

        $manager.course.partitions = $manager.course.partitions;
        $config = $config;

        name = "";
        description = "";

        $manager.sync();
    }
</script>

<Modal
    open={$isPartitionModalOpen}
    modalHeading="Create partition"
    primaryButtonText="Submit"
    secondaryButtonText="Cancel"
    hasForm
    formId="partition-form"
    primaryButtonDisabled={name === ""}
    on:click:button--secondary={() => ($isPartitionModalOpen = false)}
    on:close={() => ($isPartitionModalOpen = false)}
>
    <form id="partition-form" onsubmit={handleSubmit}>
        <Stack gap={5}>
            <TextInput bind:value={name} labelText="Name" placeholder="Enter partition name" />
            <TextArea
                bind:value={description}
                labelText="Description"
                placeholder="Enter a brief partition description (optional)"
            />
        </Stack>
    </form>
</Modal>
