<script lang="ts">
    import {
        Button,
        Column,
        ContainedList,
        ContainedListItem,
        Grid,
        InlineLoading,
        InlineNotification,
        Row,
        Tile,
        TreeView
    } from "carbon-components-svelte";

    import { Partition } from "$lib/types/Partition.svelte";
    import { selection } from "./shared.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { Shuffle } from "carbon-icons-svelte";
    import { type Randomized, results } from "$lib/results.svelte";
    import icon from "$lib/assets/favicon.svg";

    let isPoolEmpty: boolean = $derived(selection.courses.length == 0 || selection.partitions.length == 0 || $results.length == 0);
    let result: Promise<Randomized[]> = $state(Promise.resolve([]));
    let treeview: TreeView|null = $state(null);
    let expandTree: boolean = $state(false);

    onMount(() => {
        if ($results.length > 0) {
            expandTree = true;
            result = Promise.resolve($results);
        }
    });

    function getPoolName(partition: Partition): string {
        return partition.name + " (" + partition.runtime.range[0] + " — " + partition.runtime.range[1] + ")";
    }

    function getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function randomize(): Promise<Randomized[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let output: Randomized[] = [];
                    let index: number = 0;

                    for (const course of selection.courses) {
                        index += 1;

                        output.push({
                            id: index + "-course",
                            text: course.name,
                            courseId: course.id,
                            nodes: []
                        });

                        let numberOfProblems: number = 0;
                        let randomized: Randomized = output[output.length - 1];

                        const cache: Map<string, Partition> = new Map();

                        for (const partition of course.partitions) {
                            if (partition.runtime.selected) {
                                index += 1;

                                randomized.nodes.push({
                                    id: index + "-partition",
                                    text: partition.name,
                                    partitionId: partition.id,
                                    problems: new Set<number>(),
                                    nodes: []
                                });

                                cache.set(partition.id, partition);
                            }
                        }

                        if (randomized.nodes.length === 0) {
                            index += 1;
                            randomized.nodes.push({
                                id: index,
                                text: "No partitions were selected.",
                                partitionId: "",
                                problems: new Set<number>()
                            });

                            continue;
                        }

                        while (numberOfProblems < course.runtime.numberOfProblems) {
                            let randomIndex = getRandomNumber(0, randomized.nodes.length - 1);
                            let section = randomized.nodes[randomIndex];
                            let partition = cache.get(section.partitionId) ?? Partition.empty();
                            let problem = getRandomNumber(partition.runtime.range[0], partition.runtime.range[1]);

                            if (!cache.has(section.partitionId)) {
                                console.warn(`Section "${section.partitionId}" not found.`);
                            }

                            if (!section.problems.has(problem)) {
                                section.problems.add(problem);
                                numberOfProblems += 1;
                            }
                        }

                        for (const section of randomized.nodes) {
                            if (section.nodes == null) {
                                continue;
                            }

                            index += 1;
                            section.nodes.push({ id: index, text: Array.from(section.problems).sort((a, b) => a - b).join(", ") });
                        }
                    }

                    expandTree = true;
                    $results = output;

                    resolve(output);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }, getRandomNumber(1000, 2500));
        });
    }

    $effect(() => {
        if (expandTree && treeview != null) {
            expandTree = false;
            treeview.expandAll();
        }
    });
</script>

<Tile>
    <h4 class="heading">Problem Pool</h4>
    <p class="subheading">The following pool will be used to generate a randomized list of problems.</p>
    <div class="divider"></div>
    {#if isPoolEmpty}
        <div style="display: flex;">
            <InlineNotification
                lowContrast
                hideCloseButton
                kind="warning"
                title="Make Selection:"
                subtitle="To generate a random list, you must select at least one course and one partition from the courses list."
                style="max-width: fit-content;"
            />
        </div>
    {/if}
</Tile>
{#if !isPoolEmpty}
    <div style="max-height: 30vh; overflow-y: auto;">
    {#each selection.courses as course (course.id)}
        <ContainedList labelText={course.name} kind="disclosed" size="sm">
        {#each course.partitions as partition (partition.id)}
            {#if partition.runtime.selected && partition.parent.id === course.id}
                <ContainedListItem>{getPoolName(partition)}</ContainedListItem>
            {/if}
        {/each}
        </ContainedList>
    {/each}
    </div>
{/if}

<Tile>
    <Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
        <Row>
            <Column>
                <Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
                    <Row>
                        <Column style="flex: 0 1; padding-right: 8px;">
                            <img src={icon} alt="Homework randomizer logo" width="52rem" height="52rem" />
                        </Column>
                        <Column>
                            <h4 class="heading">Your Problems</h4>
                            <p class="subheading">Randomized pool of homework problems.</p>
                        </Column>
                    </Row>
                </Grid>
            </Column>
            <Column>
                <div style="display: flex; justify-content: end;">
                    <Button icon={Shuffle} disabled={isPoolEmpty} on:click={() => result = randomize()} style="flex: 0;">
                        Randomize
                    </Button>
                </div>
            </Column>
        </Row>
    </Grid>
    <div class="divider"></div>
    {#await result}
        <InlineLoading status="active" description="Generating..."/>
    {:then output}
        <div in:fade>
            {#if output.length === 0}
                <div style="display: flex;">
                    <InlineNotification
                        lowContrast
                        hideCloseButton
                        kind="info-square"
                        title="Randomize:"
                        subtitle="To generate a random list, click the randomize button above!"
                        style="max-width: fit-content;"
                    />
                </div>
            {:else}
                <TreeView
                    labelText="Results"
                    size="compact"
                    nodes={output}
                    bind:this={treeview}
                    let:node
                >
                <span
                    style:text-decoration={node.id.toString().endsWith("partition") ? "underline" : "inherit"}
                    style:font-weight={node.id.toString().endsWith("course") ? "bold" : "inherit"}
                >
                    {node.text}
                </span>
                </TreeView>
            {/if}
        </div>
    {:catch error}
        <div style="display: flex;">
            <InlineNotification
                lowContrast
                hideCloseButton
                kind="error"
                title="Error:"
                subtitle={error.message}
                style="max-width: fit-content;"
            />
        </div>
    {/await}
</Tile>