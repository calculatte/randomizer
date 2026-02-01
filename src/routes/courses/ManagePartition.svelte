<script lang="ts">
    import {
        Button,
        ButtonSet,
        Column,
        Grid,
        InlineNotification,
        Modal,
        NumberInput,
        Row,
        Stack,
        TextArea,
        TextInput,
    } from "carbon-components-svelte";

    import { Save, TrashCan } from "carbon-icons-svelte";
    import { Partition } from "$lib/types/Partition.svelte";
    import { config } from "$lib/config.svelte.js";
    import { manager } from "./shared.svelte";

    let name: string = $derived($manager.partition != null ? $manager.partition.name : "Select a partition to manage...");
    let description: string = $derived($manager.partition != null ? $manager.partition.description : "Select a partition to manage...");
    let deleteName: string = $state("");
    let isConfirmDeleteOpen: boolean = $state(false);

    function isEditingDisabled() {
        return $manager.partition == null || $manager.course == null;
    }

    function isSaveDisabled() {
        if (isEditingDisabled() || $manager.isInvalidStartAt() || $manager.isInvalidEndAt() || $manager.partition == null) {
            return true;
        }

        let isRangeUnchanged: boolean = $manager.startAt == $manager.partition.getStartAt() && $manager.endAt == $manager.partition.getEndAt();
        let isInfoUnchanged: boolean = $manager.partition.name == name && $manager.partition.description == description;

        return isRangeUnchanged && isInfoUnchanged;
    }

    function isDeleteDisabled() {
        return isEditingDisabled();
    }

    function sync() {
        if ($manager.partition == null || $manager.course == null) {
            return;
        }

        $manager.partition.setStartAt($manager.startAt);
        $manager.partition.setEndAt($manager.endAt);

        let found = $manager.course.findPartition($manager.partition.id);

        if (found) {
            found.name = name;
            found.description = description;

            $manager.partition = found;
            $config = $config;
        }

        $manager.sync();
    }

    function openConfirmDelete() {
        deleteName = $manager.partition == null ? "null" : $manager.partition.name;
        isConfirmDeleteOpen = true;
    }

    function handleDelete() {
        if ($manager.course == null || $manager.partition == null) {
            return;
        }

        $manager.course.removePartition($manager.partition.id);

        $manager.partition = null;
        $config = $config;

        isConfirmDeleteOpen = false;

        $manager.sync();
    }
</script>

<Modal
    danger
    open={isConfirmDeleteOpen}
    modalHeading="Delete partition"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    on:click:button--primary={handleDelete}
    on:click:button--secondary={() => (isConfirmDeleteOpen = false)}
    on:close={() => (isConfirmDeleteOpen = false)}
>
    <p>You are about to delete <strong>{deleteName}</strong>.</p>
    <p>This is a <strong>permanent</strong> action and cannot be undone.</p>
</Modal>

{#if $manager.course == null}
    <div style="display: flex;">
        <InlineNotification
            lowContrast
            hideCloseButton
            kind="warning"
            title="Select course:"
            subtitle="To manage a partition, you must select a course from the courses list."
            style="max-width: fit-content;"
        />
    </div>
{/if}

{#if $manager.course != null && $manager.course.partitions.length === 0}
    <InlineNotification
        lowContrast
        hideCloseButton
        kind="warning"
        title="Create partition:"
        subtitle="To manage a partition, you must create one using the blue button above."
    />
{:else if $manager.course != null && $manager.partition == null}
    <InlineNotification
        lowContrast
        hideCloseButton
        kind="warning"
        title="Select partition:"
        subtitle="To manage a partition, you must select one from the list above."
    />
{:else if $manager.course != null && $manager.partition != null}
    <div style="margin-top: var(--cds-spacing-04)"></div>
{/if}

<Grid style="margin: 0; padding: 0;">
    <Row>
        <Column>
            <Stack gap={4} style="margin-top: 1em">
                <div>
                    <TextInput
                        bind:value={name}
                        labelText="Partition name"
                        placeholder="Enter a partition name..."
                        disabled={isEditingDisabled()}
                    />
                </div>
                <div>
                    <TextArea
                        bind:value={description}
                        labelText="Partition description"
                        placeholder="Give a brief partition description..."
                        disabled={isEditingDisabled()}
                    />
                </div>
            </Stack>
        </Column>
        <Column>
            <Stack gap={4} style="margin-top: 1em">
                <Stack gap={4} orientation="horizontal" justify="space-evenly">
                    <div style="flex-basis: 100%">
                        <NumberInput
                            min={Partition.START_AT}
                            step={1}
                            bind:value={$manager.startAt}
                            disabled={isEditingDisabled()}
                            labelText="Start at (1 min, infinite max)"
                            helperText="Define the problem number this partition starts at"
                            warn={$manager.startAt > 500}
                            warnText="What textbook are you reading?"
                            invalid={$manager.isInvalidStartAt()}
                            invalidText="Number must be greater than 0 and be less than the ending problem number."
                        />
                    </div>
                    <div style="flex-basis: 100%">
                        <NumberInput
                            min={Partition.START_AT}
                            step={1}
                            bind:value={$manager.endAt}
                            disabled={isEditingDisabled()}
                            labelText="End at (1 min, infinite max)"
                            helperText="Define the problem number this partition ends at"
                            warn={$manager.endAt > 500}
                            warnText="What textbook are you reading?"
                            invalid={$manager.isInvalidEndAt()}
                            invalidText="Number must be greater than 0 and be greater than the starting problem number."
                        />
                    </div>
                </Stack>
            </Stack>
        </Column>
    </Row>
    <Row>
        <Column>
            <div style="margin-top: 16px">
                <ButtonSet>
                    <Button style="flex-shrink: 1;" icon={Save} disabled={isSaveDisabled()} on:click={sync}>Save changes</Button>
                    <Button style="flex-shrink: 1;" icon={TrashCan} disabled={isDeleteDisabled()} on:click={openConfirmDelete} kind="danger-tertiary">Delete partition</Button>
                </ButtonSet>
            </div>
        </Column>
    </Row>
</Grid>
