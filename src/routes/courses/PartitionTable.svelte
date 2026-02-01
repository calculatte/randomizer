<script lang="ts">
    import {
        Button,
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch
    } from "carbon-components-svelte";

    import { Add } from "carbon-icons-svelte";
    import { config } from "$lib/config.svelte.js";
    import { manager, isPartitionModalOpen } from "./shared.svelte";
    import MakePartition from "./MakePartition.svelte";

    let selectedRowIds: string[] = $state([]);

    $effect(() => {
        if ($manager.partition == null && selectedRowIds.length > 0) {
            selectedRowIds = [];
        }

        if ($manager.refresh) {
            $manager.refresh = false;

            $manager.rows.courses = $config.courses;

            if ($manager.course != null) {
                $manager.rows.partitions = $manager.course.partitions;
            }
        }
    });

    function isCreateDisabled() {
        return $manager.course == null;
    }
</script>

<MakePartition />
<DataTable
    radio
    sortable
    selectable
    stickyHeader
    size="short"
    title="Partitions"
    description="Select a partition to manage."
    style="padding-top: 0;"
    bind:selectedRowIds
    headers={[
        { key: "name", value: "Partition Name" },
        { key: "startAt", value: "Starts At" },
        { key: "endAt", value: "Ends At" },
        { key: "problems", value: "Number of Problems" },
    ]}
    on:click:row--select={(event) => {
        $manager.partition = event.detail.row;
        selectedRowIds = [ $manager.partition.id ];
        $manager.startAt = $manager.partition.getStartAt();
        $manager.endAt = $manager.partition.getEndAt();
    }}
    rows={$manager.rows.partitions}
>
    <Toolbar>
        <ToolbarContent>
            <ToolbarSearch
                shouldFilterRows={(row, value) => {
                    return row.name.toLowerCase().includes(String(value).toLowerCase());
                }}
            />
            <Button on:click={() => ($isPartitionModalOpen = true)} disabled={isCreateDisabled()} icon={Add}>Create partition</Button>
        </ToolbarContent>
    </Toolbar>

    <svelte:fragment slot="cell" let:row let:cell>
        <div>
            {#if cell.key === "startAt"}
                {row.getStartAt()}
            {:else if cell.key === "endAt"}
                {row.getEndAt()}
            {:else if cell.key === "problems"}
                {row.getNumberOfProblems()}
            {:else}
                {cell.value}
            {/if}
        </div>
    </svelte:fragment>
</DataTable>