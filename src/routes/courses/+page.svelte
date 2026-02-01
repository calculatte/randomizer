<script lang="ts">
    import { Column, Content, Grid, Row, Tab, TabContent, Tabs } from "carbon-components-svelte";
    import { Manager } from "./types/Manager";

    import CourseTable from "./CourseTable.svelte"
    import ManageCourse from "./ManageCourse.svelte";
    import PartitionTable from "./PartitionTable.svelte";
    import ManagePartition from "./ManagePartition.svelte";

    import { manager } from "./shared.svelte";
    import Config from "../Config.svelte";

    $manager = new Manager();
</script>

<style>
    :global(.bx--tab-content) {
        padding: 0 !important;
    }
</style>

<Content>
    <Grid padding>
        <Row>
            <Column>
                <Config/>
            </Column>
        </Row>
        <Row>
            <Column>
                <Tabs type="container">
                    <Tab label="Manage Courses"/>
                    <Tab label="Manage Partitions"/>
                    <svelte:fragment slot="content">
                        <TabContent>
                            <CourseTable />
                            <div class="divider"></div>
                            <ManageCourse />
                        </TabContent>
                        <TabContent>
                            <PartitionTable />
                            <div class="divider"></div>
                            <ManagePartition />
                        </TabContent>
                    </svelte:fragment>
                </Tabs>
            </Column>
        </Row>
    </Grid>
</Content>