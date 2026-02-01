<script lang="ts">
    import { Column, Grid, Row, Tabs, Tab, TabContent, Button } from "carbon-components-svelte";

    import Selection from "./Selection.svelte";
    import Randomizer from "./Randomizer.svelte";

    import { ArrowRight, IbmKnowledgeCatalog } from "carbon-icons-svelte";
    import { config } from "$lib/config.svelte.js";
</script>

<style>
    :global(.bx--accordion__content) {
        padding-right: 0;
    }
</style>

{#if $config.courses.length > 0}
    <Tabs type="container">
        <Tab label="Courses" />
        <Tab label="Randomize" />
        <svelte:fragment slot="content">
            <TabContent style="padding: 0;">
                <Selection/>
            </TabContent>
            <TabContent style="padding: 0;">
                <Randomizer/>
            </TabContent>
        </svelte:fragment>
    </Tabs>
{:else}
    <div style="display: flex; justify-content: center;">
        <Grid>
            <Row>
                <Column>
                    <h1>Make Courses</h1>
                </Column>
            </Row>
            <Row>
                <Column>
                    <div style="display: flex; justify-content: center;">
                        <IbmKnowledgeCatalog size={48}/>
                    </div>
                </Column>
            </Row>
            <Row>
                <Column>
                    <div style="display: flex; justify-content: center;">
                        <Button icon={ArrowRight} href="/courses">Go to course builder</Button>
                    </div>
                </Column>
            </Row>
        </Grid>
    </div>
{/if}
