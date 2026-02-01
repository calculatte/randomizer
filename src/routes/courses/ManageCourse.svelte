<script lang="ts">
    import {
        Button,
        ButtonSet,
        InlineNotification,
        Modal,
        Stack,
        TextArea,
        TextInput
    } from "carbon-components-svelte";

    import { Save, TrashCan } from "carbon-icons-svelte";
    import { config } from "$lib/config.svelte.js";
    import { manager } from "./shared.svelte";

    let name: string = $derived($manager.course != null ? $manager.course.name : "Select a course to manage...");
    let description: string = $derived($manager.course != null ? $manager.course.description : "Select a course to manage...");
    let deleteName: string = $state("");
    let isConfirmDeleteOpen: boolean = $state(false);

    function isEditingDisabled() {
        return $manager.course == null;
    }

    function isSaveDisabled() {
        if (isEditingDisabled()) {
            return true;
        }

        return $manager.course != null && $manager.course.name == name && $manager.course.description == description;
    }

    function isDeleteDisabled() {
        return $manager.course == null;
    }

    function sync() {
        if ($manager.course == null) {
            return;
        }

        let found = $config.findCourse($manager.course.id);

        if (found) {
            found.name = name;
            found.description = description;

            $manager.course = found;
            $config = $config;
        }
    }

    function openConfirmDelete() {
        deleteName = $manager.course == null ? "null" : $manager.course.name;
        isConfirmDeleteOpen = true;
    }

    function handleDelete() {
        if ($manager.course == null) {
            return;
        }

        $config.removeCourse($manager.course.id);
        $config = $config;

        $manager.course = null;
        isConfirmDeleteOpen = false;
    }
</script>

<Modal
    danger
    open={isConfirmDeleteOpen}
    modalHeading="Delete course"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    on:click:button--primary={handleDelete}
    on:click:button--secondary={() => (isConfirmDeleteOpen = false)}
    on:close={() => (isConfirmDeleteOpen = false)}
>
    <p>You are about to delete <strong>{deleteName}</strong>.</p>
    <p>This is a <strong>permanent</strong> action and cannot be undone.</p>
</Modal>

{#if $config.courses.length === 0}
    <div style="display: flex;">
        <InlineNotification
            lowContrast
            hideCloseButton
            kind="warning"
            title="Create course:"
            subtitle="To manage a course, you must create one using the blue button above."
            style="max-width: fit-content;"
        />
    </div>
{:else if $manager.course == null}
    <div style="display: flex;">
        <InlineNotification
            lowContrast
            hideCloseButton
            kind="warning"
            title="Select course:"
            subtitle="To manage a course, you must select one from the courses list."
            style="max-width: fit-content;"
        />
    </div>
{:else}
    <div style="margin-top: var(--cds-spacing-04)"></div>
{/if}

<Stack gap={4}>
    <div>
        <TextInput
            bind:value={name}
            labelText="Course name"
            placeholder="Enter a course name..."
            disabled={isEditingDisabled()}
        />
    </div>
    <div>
        <TextArea
            bind:value={description}
            labelText="Course description"
            placeholder="Give a brief course description..."
            disabled={isEditingDisabled()}
        />
    </div>

    <ButtonSet>
        <Button style="flex-shrink: 1;" icon={Save} disabled={isSaveDisabled()} on:click={sync}>Save changes</Button>
        <Button style="flex-shrink: 1;" icon={TrashCan} disabled={isDeleteDisabled()} on:click={openConfirmDelete} kind="danger-tertiary">Delete course</Button>
    </ButtonSet>
</Stack>
