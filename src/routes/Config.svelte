<script lang="ts">
    import { Button, ButtonSet, Column, FileUploaderButton, Grid, Row } from "carbon-components-svelte";
    import { DocumentAdd, Download } from "carbon-icons-svelte";

    import { config } from "$lib/config.svelte.js";
    import { isMobileDevice } from "$lib/util";
    import { onMount } from "svelte";

    let isMobile: boolean = $state(false);

    onMount(() => {
        isMobile = isMobileDevice(window);
    });
</script>

<Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
    <Row>
        <Column sm={2} md={2} lg={2}>
            <h4 class="heading">Config File</h4>
            <p class="note">Only JSON files are accepted.</p>
        </Column>
        <Column>
            <ButtonSet stacked={isMobile}>
                <FileUploaderButton
                    kind="tertiary"
                    style="flex-shrink: 1;"
                    icon={DocumentAdd}
                    labelText="Add file"
                    accept={[".json"]}
                />
                <Button
                    style="margin-left: { isMobile ? 0 : '1px' }; flex-shrink: { isMobile ? 1 : 0 }; margin-top: { isMobile ? '1px' : 0 };"
                    size="field"
                    kind="ghost"
                    icon={Download}
                    onclick={() => $config.download()}
                >
                    Download config
                </Button>
            </ButtonSet>
        </Column>
    </Row>
</Grid>
<div class="divider"></div>