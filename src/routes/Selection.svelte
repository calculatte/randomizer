<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Checkbox,
        Column,
        Grid, InlineNotification,
        Row,
        Tile
    } from "carbon-components-svelte";

    import { RangeSlider } from "svelte-range-slider-pips";
    import { config } from "$lib/config.svelte.js";
    import { selection } from "./shared.svelte";
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
    <h4 class="heading">Select Courses</h4>
    <p class="subheading">Choose which courses and partitions to get randomized problems from.</p>
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
                        <div style="display: flex; justify-content: center;">
                            <p class="note">Number of problems ({course.runtime.numberOfProblems})</p>
                        </div>
                        <RangeSlider
                            id="always"
                            value={course.runtime.numberOfProblems}
                            disabled={!course.runtime.selected}
                            min={1}
                            max={course.getNumberOfProblems()}
                            step={1}
                            pipstep={1}
                            first="label"
                            last="label"
                            all={false}
                            pips
                            on:change={(event) => course.runtime.numberOfProblems = event.detail.value}
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
                                pipstep={1}
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