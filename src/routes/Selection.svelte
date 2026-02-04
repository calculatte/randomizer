<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Button,
        Checkbox,
        Column,
        Grid,
        InlineNotification,
        NumberInput,
        Row,
        Tile
    } from "carbon-components-svelte";

    import { ListBoxes, ListChecked } from "carbon-icons-svelte";
    import { RangeSlider } from "svelte-range-slider-pips";

    import { config } from "$lib/config.svelte.js";
    import { selection } from "./shared.svelte";
    import { onMount } from "svelte";
    import { isMobileDevice } from "$lib/util";
    import type { Course } from "$lib/types/Course.svelte";

    let isMobile: boolean = $state(false);

    onMount(() => {
        isMobile = isMobileDevice(window);
    });

    function toggleAll(state: boolean): void {
        $config.courses.forEach(course => {
            if (course.partitions.length > 0) {
                course.runtime.selected = state;

                course.partitions.forEach(partition => {
                    partition.runtime.selected = state;
                });
            } else if (!state) {
                course.runtime.selected = state;
            }
        });
    }

    function handleCourseAmount(course: Course, amount: number | null): void {
        if (typeof amount == "number") {
            if (amount < 1) {
                course.runtime.numberOfProblems = 1;
            } else if (amount > course.getNumberOfProblems()) {
                course.runtime.numberOfProblems = course.getNumberOfProblems();
            } else {
                course.runtime.numberOfProblems = amount;
            }
        } else {
            course.runtime.numberOfProblems = 1;
        }
    }
</script>

<style>
    :global(#always .rangeFloat) {
        opacity: 1;
        translate: -50% 0;
    }

    :global(.bx--accordion__heading) {
        background-color: var(--cds-layer) !important;
    }
</style>

<Tile>
    <Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
        <Row>
            <Column>
                <h4 class="heading">Select Courses</h4>
                <p class="subheading">Choose which courses and partitions to get randomized problems from.</p>
            </Column>
            <Column>
                <div style="display: flex; justify-content: end;">
                    {#if isMobile}
                        <Button icon={ListChecked} on:click={() => toggleAll(true)} />
                    {:else}
                        <Button icon={ListChecked} on:click={() => toggleAll(true)}>
                            Select all
                        </Button>
                    {/if}
                    <Button icon={ListBoxes} on:click={() => toggleAll(false)} iconDescription="Deselect all" kind="secondary" />
                </div>
            </Column>
        </Row>
    </Grid>
    <div class="divider"></div>
</Tile>

{#each $config.courses as course}
    <Tile>
        <Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
            <Row>
                <Column>
                    <Checkbox
                        labelText={course.name}
                        helperText={course.description === "" ? "No description." : course.description}
                        disabled={course.partitions.length === 0}
                        bind:checked={course.runtime.selected}
                        on:check={() => {
                            selection.courses = $config.getSelectedCourses();
                        }}
                    />
                </Column>
                <Column>
                    {#if course.getNumberOfProblems() > 0}
                        <NumberInput
                            light={true}
                            min={1}
                            max={course.getNumberOfProblems()}
                            invalid={course.runtime.numberOfProblems < 1 || course.runtime.numberOfProblems > course.getNumberOfProblems()}
                            labelText="Number of problems"
                            helperText="Select the number of problems to pick from this course."
                            invalidText="Problem amount must be greater than 1 and less than {course.getNumberOfProblems()}."
                            disabled={!course.runtime.selected}
                            bind:value={course.runtime.numberOfProblems}
                            on:change={(event) => handleCourseAmount(course, event.detail)}
                        />
                    {:else}
                        <div style="display: flex;">
                            <InlineNotification
                                lowContrast
                                hideCloseButton
                                kind="error"
                                title="Invalid:"
                                subtitle="This course cannot be selected since it does not have any problems."
                                style="max-width: fit-content;"
                            />
                        </div>
                    {/if}
                </Column>
            </Row>
        </Grid>
    </Tile>
    <Accordion align="start">
        <AccordionItem title="Partitions" style="margin-bottom: 16px;">
            {#if course.partitions.length === 0}
                <p>This course does not have any partitions.</p>
            {/if}
            {#each course.partitions as partition, i}
                {#if i === 0}
                    <div style="margin-top: 16px;"></div>
                {/if}
                {#if i > 0 && i < course.partitions.length}
                    <div class="divider" style="margin-bottom: 20px"></div>
                {/if}
                <Grid condensed>
                    <Row>
                        <Column>
                            <Checkbox
                                labelText={partition.name}
                                helperText={partition.description === "" ? "No description." : partition.description}
                                bind:checked={partition.runtime.selected}
                                disabled={!course.runtime.selected}
                                on:check={() => {
                                    selection.partitions = $config.getSelectedPartitions();
                                }}
                            />
                        </Column>
                        <Column>
                            <RangeSlider
                                id="always"
                                values={partition.runtime.range}
                                disabled={!partition.runtime.selected || !course.runtime.selected}
                                min={partition.getStartAt()}
                                max={partition.getEndAt()}
                                step={1}
                                pipstep={1000}
                                first="label"
                                last="label"
                                all={false}
                                rangeFloat
                                range
                                pips
                            />
                        </Column>
                    </Row>
                </Grid>
            {/each}
        </AccordionItem>
    </Accordion>
{/each}