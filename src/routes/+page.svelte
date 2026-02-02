<script lang="ts">
    import { Loading } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { toast } from "$lib/toast.svelte";
    import { config } from "$lib/config.svelte.js";
    import { loaded, notifyOnReload } from "$lib/store";

    import Home from "./Home.svelte";

    onMount(() => {
        if ($loaded) {
            return;
        }

        setTimeout(() => {
            if ($config.courses.length > 0 && $notifyOnReload) {
                toast.emit("show", {
                    title: "Reloaded",
                    subtitle: "Successfully rebuilt config from local storage.",
                    timeout: 4000
                });
            }

            $loaded = true;
        }, 1000);
    });
</script>

<style>
    :global(.bx--accordion__content) {
        padding-right: 0;
    }
</style>

{#if !$loaded}
    <div transition:fade={{ duration: 500 }}>
        <Loading />
    </div>
{:else}
    <div transition:fade={{ duration: 500 }}>
        <Home />
    </div>
{/if}