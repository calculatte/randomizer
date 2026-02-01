<script lang="ts">
    import {
        Button,
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch
    } from "carbon-components-svelte";

    import { Add } from "carbon-icons-svelte";
    import MakeCourse from "./MakeCourse.svelte";

    import { config } from "$lib/config.svelte.js";
    import { manager, isCourseModalOpen } from "./shared.svelte";

    let selectedRowIds: string[] = $state([]);

    $effect(() => {
        $manager.rows.courses = $config.courses;
    });
</script>

<DataTable
    radio
    sortable
    selectable
    stickyHeader
    size="short"
    title="Courses"
    description="Select a course manage."
    style="padding-top: 0;"
    bind:selectedRowIds
    headers={[
        { key: "name", value: "Course Name" },
        { key: "partitions", value: "Number of Partitions" },
        { key: "problems", value: "Number of Problems" }
    ]}
    on:click:row--select={(event) => {
        $manager.partition = null;
        $manager.course = event.detail.row;

        let found = $config.findCourse(event.detail.row.id);

        if (found != null) {
            $manager.rows.partitions = found.partitions;
        }
    }}
    rows={$manager.rows.courses}
>
    <Toolbar>
        <ToolbarContent>
            <ToolbarSearch
                shouldFilterRows={(row, value) => {
                    return row.name.toLowerCase().includes(String(value).toLowerCase());
                }}
            />
            <Button on:click={() => ($isCourseModalOpen = true)} icon={Add}>Create course</Button>
        </ToolbarContent>
    </Toolbar>

    <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === "partitions"}
            {row.getNumberOfPartitions()}
        {:else if cell.key === "problems"}
            {row.getNumberOfProblems()}
        {:else}
            {cell.value}
        {/if}
    </svelte:fragment>
</DataTable>

<MakeCourse />