<script lang="ts">
    import { Modal, Stack, TextArea, TextInput } from "carbon-components-svelte";
    import { isCourseModalOpen } from "./shared.svelte";
    import { config } from "$lib/config.svelte.js";

    let name: string = $state("");
    let description: string = $state("");

    function handleSubmit() {
        $config.addCourse(name, description);
        $isCourseModalOpen = false;

        $config = $config;

        name = "";
        description = "";
    }
</script>

<Modal
    open={$isCourseModalOpen}
    modalHeading="Create course"
    primaryButtonText="Submit"
    secondaryButtonText="Cancel"
    hasForm
    formId="course-form"
    primaryButtonDisabled={name === ""}
    on:click:button--secondary={() => ($isCourseModalOpen = false)}
    on:close={() => ($isCourseModalOpen = false)}
>
    <form id="course-form" onsubmit={handleSubmit}>
        <Stack gap={5}>
            <TextInput bind:value={name} labelText="Name" placeholder="Enter course name" />
            <TextArea
                bind:value={description}
                labelText="Description"
                placeholder="Enter a brief course description (optional)"
            />
        </Stack>
    </form>
</Modal>