<script lang="ts">
    import { HeaderGlobalAction } from "carbon-components-svelte";
    import { Asleep, LightFilled } from "carbon-icons-svelte";

    import { theme } from "$lib/store";
</script>

<HeaderGlobalAction
    tooltipAlignment="end"
    iconDescription={$theme === "g10" ? "Dark Mode" : "Light Mode" }
    icon={$theme === "g10" ? Asleep : LightFilled}
    onclick={() => {
        if ($theme === "g10") {
            $theme = "g90";
        } else {
            $theme = "g10";
        }
    }}
/>
