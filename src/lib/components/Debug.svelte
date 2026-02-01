<script lang="ts">
    import { HeaderGlobalAction } from "carbon-components-svelte";
    import { Debug, Settings } from "carbon-icons-svelte";
    import { Settings as SettingsRef } from "$lib/routes";

    import { config } from "$lib/config.svelte.js";
    import { toast } from "$lib/toast.svelte";
    import { developerMode } from "$lib/store";
    import RickRoll from "$lib/components/RickRoll.svelte";

    let rickrolling: boolean = $state(false);
    let activate: boolean = $state(false);
</script>


{#if activate}
    <RickRoll open={rickrolling} />
{/if}

{#if $developerMode}
    <HeaderGlobalAction
        style="display: flex; justify-content: center;"
        hideTooltip
        icon={Debug}
        onclick={() => {
            console.log("Config: ", JSON.stringify($config, null, 2));
            toast.emit("show", { title: "Debug", subtitle: "Printed config to console." });
            activate = true;
            rickrolling = true;
        }}
    />
{:else}
    <HeaderGlobalAction
        tooltipAlignment="end"
        iconDescription="Application Settings"
        icon={Settings}
        href={SettingsRef}
    />
{/if}
