<script lang="ts">
    import { HeaderGlobalAction } from "carbon-components-svelte";
    import { Save } from "carbon-icons-svelte";
    import { config } from "$lib/config.svelte.js";
</script>

<HeaderGlobalAction
    tooltipAlignment="end"
    iconDescription="Download Config"
    icon={Save}
    onclick={() => $config.download()}
/>
