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

    import { CharacterWholeNumber, ListBoxes, ListChecked, Number_1, Number_2 } from "carbon-icons-svelte";
    import { RangeSlider } from "svelte-range-slider-pips";

    import type { Partition, PoolType } from "$lib/types/Partition.svelte";
    import type { Course } from "$lib/types/Course.svelte";
    import { config } from "$lib/config.svelte.js";
    import { onMount } from "svelte";
    import { isMobileDevice } from "$lib/util/misc";
    import { globalPoolSize, selection } from "$lib/util/randomize.svelte";

    let isMobile: boolean = $state(false);

    onMount(() => {
        isMobile = isMobileDevice(window);
    });

    function toggleAll(state: boolean): void {
        $config.courses.forEach(course => {
            let selector = document.getElementById(`app-select-all-${course.id}`);

            if (course.partitions.length > 0) {
                if (selector instanceof HTMLInputElement) {
                    selector.checked = state;
                }

                course.runtime.selected = state;

                course.partitions.forEach(partition => {
                    partition.runtime.selected = state;
                });
            } else if (!state) {
                if (selector instanceof HTMLInputElement) {
                    selector.checked = state;
                }

                course.runtime.selected = state;
            }
        });

        selection.courses = $config.getSelectedCourses();
        selection.partitions = $config.getSelectedPartitions();
    }

    function handleCourseToggleAll(course: Course, state: boolean): void {
        course.partitions.forEach(partition => {
            partition.runtime.selected = state;
        });

        selection.partitions = $config.getSelectedPartitions();
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

    function getNumberOfSelectedPartitions(course: Course): number {
        let selections = course.partitions.map(partition => partition.runtime.selected);
        let nSelected = 0;

        selections.forEach(state => {
            if (state) {
                nSelected++;
            }
        });

        return nSelected;
    }

    function isCourseIndeterminate(course: Course): boolean {
        let numberOfSelected = getNumberOfSelectedPartitions(course);

        return numberOfSelected > 0 && numberOfSelected < course.partitions.length;
    }

    function getMaxNumberOfProblems(): number {
        return $config.courses.map(course => course.getNumberOfProblems()).reduce((a, b) => a + b, 0);
    }

    function isGlobalNumberInvalid(): boolean {
        if (typeof $globalPoolSize !== "number") {
            return false;
        }

        return $globalPoolSize < 1 || $globalPoolSize > getMaxNumberOfProblems();
    }

    function handleGlobalNumber(amount: number | null): void {
        if (typeof amount !== "number") {
            $globalPoolSize = null;
        } else {
            let max: number = getMaxNumberOfProblems();

            if (amount < 1) {
                $globalPoolSize = 1;
            } else if (amount > max) {
                $globalPoolSize = max;
            } else {
                $globalPoolSize = amount;
            }
        }
    }

    function handlePartitionRange(partition: Partition, range: number[]): void {
        partition.runtime.range[0] = range[0];
        partition.runtime.range[1] = range[1];
    }

    function handlePoolBatchEdit(course: Course, type: PoolType): void {
        course.partitions.forEach(partition => {
            partition.runtime.poolType = type;
        });
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
    <div class="divider" style="margin-bottom: 16px;"></div>
    <NumberInput
        allowEmpty={true}
        light={true}
        min={1}
        max={getMaxNumberOfProblems()}
        invalid={isGlobalNumberInvalid()}
        labelText="Global number of problems"
        invalidText="Problem amount must be greater than 1 and less than {getMaxNumberOfProblems()}."
        disabled={false}
        bind:value={$globalPoolSize}
        on:change={(event) => handleGlobalNumber(event.detail)}
    />
    <p class="note" style="margin-top: .25rem;">Define how many problems you want randomly generated from <em>all</em> courses.</p>
    <p class="note">
        This will <span style="color: var(--cds-text-error, #da1e28);">override</span> the number of problems selected for individual courses.
        If this is not desired, then leave this blank.
    </p>
</Tile>

{#each $config.courses as course}
    <Tile style="margin-top: 16px;">
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
                    <Checkbox
                        id="app-select-all-{course.id}"
                        style="margin-top: 16px;"
                        labelText="Select all"
                        helperText="Get problems from all partitions in {course.name}."
                        disabled={course.partitions.length === 0 || !course.runtime.selected}
                        indeterminate={isCourseIndeterminate(course)}
                        on:check={(event) => {
                            handleCourseToggleAll(course, event.detail);
                        }}
                    />
                </Column>
                <Column>
                    {#if course.getNumberOfProblems() > 0}
                        <NumberInput
                            light={true}
                            min={1}
                            max={course.getNumberOfProblems()}
                            warn={typeof $globalPoolSize === "number"}
                            invalid={course.runtime.numberOfProblems < 1 || course.runtime.numberOfProblems > course.getNumberOfProblems()}
                            labelText="Number of problems"
                            helperText="Select the number of problems to pick from this course."
                            invalidText="Problem amount must be greater than 1 and less than {course.getNumberOfProblems()}."
                            warnText="This value is being overridden by the global number of problems."
                            disabled={!course.runtime.selected || typeof $globalPoolSize === "number"}
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
            <Row style="margin-top: 8px;">
                <Button
                    disabled={!course.runtime.selected}
                    style="margin-right: 4px;"
                    size="small"
                    kind="tertiary"
                    iconDescription="2&#8469+1 (Odd)"
                    icon={Number_1}
                    on:click={() => handlePoolBatchEdit(course, "odd")}
                />
                <Button
                    disabled={!course.runtime.selected}
                    style="margin-right: 4px;"
                    size="small"
                    kind="tertiary"
                    iconDescription="&#8469 (All)"
                    icon={CharacterWholeNumber}
                    on:click={() => handlePoolBatchEdit(course, "all")}
                />
                <Button
                    disabled={!course.runtime.selected}
                    size="small"
                    kind="tertiary"
                    iconDescription="2&#8469 (Even)"
                    icon={Number_2}
                    on:click={() => handlePoolBatchEdit(course, "even")}
                />
            </Row>
            <Row style="margin-top: .25rem;">
                <p class="note">Toggle all partitions to use the set of all odd or even natural integers.</p>
            </Row>
        </Grid>
    </Tile>
    <Accordion align="start">
        <AccordionItem title="Partitions">
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
                        <Column lg={4}>
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
                        <Column lg={4}>
                            <Button
                                isSelected={partition.runtime.poolType === "odd"}
                                disabled={!partition.runtime.selected || !course.runtime.selected}
                                kind="ghost"
                                iconDescription="2&#8469+1 (Odd)"
                                icon={Number_1}
                                on:click={() => partition.runtime.poolType = "odd"}
                            />
                            <Button
                                isSelected={partition.runtime.poolType === "all"}
                                disabled={!partition.runtime.selected || !course.runtime.selected}
                                kind="ghost"
                                iconDescription="&#8469 (All)"
                                icon={CharacterWholeNumber}
                                on:click={() => partition.runtime.poolType = "all"}
                            />
                            <Button
                                isSelected={partition.runtime.poolType === "even"}
                                disabled={!partition.runtime.selected || !course.runtime.selected}
                                kind="ghost"
                                iconDescription="2&#8469 (Even)"
                                icon={Number_2}
                                on:click={() => partition.runtime.poolType = "even"}
                            />
                        </Column>
                        <Column lg={8}>
                            <RangeSlider
                                id="always"
                                values={[...partition.runtime.range]}
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
                                on:change={(event) => handlePartitionRange(partition, event.detail.values)}
                            />
                        </Column>
                    </Row>
                </Grid>
            {/each}
        </AccordionItem>
    </Accordion>
{/each}