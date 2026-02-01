<script lang="ts">
    import { Column, Content, Grid, Row, Toggle } from "carbon-components-svelte";
    import { Settings } from "carbon-icons-svelte";
    import { type Setting } from "./types/Setting.ts";

    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { theme, notifyOnReload, developerMode } from "$lib/store";

    let mounted: boolean = $state(false);
    let toggles: Setting<boolean>[] = $state([]);

    toggles.push({
        title: "Dark mode",
        description: "Switch between light and dark mode.",
        get: () => $theme === "g90",
        set: (state) => {
            if (state) {
                $theme = "g90";
            } else {
                $theme = "g10";
            }
        }
    });

    toggles.push({
        title: "Show reload",
        description: "Display a message pop-up when config reloads.",
        get: () => $notifyOnReload,
        set: (state) => $notifyOnReload = state
    });

    toggles.push({
        title: "Debug mode",
        description: "Change settings icon to developer debug.",
        get: () => $developerMode,
        set: (state) => $developerMode = state
    });

    toggles.push({
        title: "Animate tables",
        description: "Slide in table entries when switching between tabs.",
        get: () => false,
        set: () => {},
        disabled: true
    });

    onMount(() => {
        mounted = true;
    });
</script>

<style>
    :global(.bx--toggle__switch) {
        margin-top: 8px !important;
    }
</style>

<Content>
    <Grid>
        <Row>
            <Column>
                <div style="display: flex; align-items: center;">
                    <Settings size={32} style="margin-right: 8px" />
                    <h1 class="title">Settings</h1>
                </div>
                <p class="subheading" style="margin-top: 8px">Manage application settings</p>
            </Column>
        </Row>
        <div class="divider"></div>
        {#if mounted}
            {#each toggles as toggle, i}
                <div in:slide|global style="margin-top: 8px;">
                    <Row>
                        <Column>
                            <p
                                class="heading"
                                style:color={toggle.disabled !== undefined && toggle.disabled ? "var(--cds-disabled-03)" : "inherit"}
                            >{toggle.title}
                            </p>
                            <Toggle
                                labelText={toggle.description}
                                toggled={toggle.get()}
                                disabled={toggle.disabled === undefined ? false : toggle.disabled}
                                on:toggle={e => toggle.set(e.detail.toggled)}
                            />
                        </Column>
                    </Row>
                    {#if i < toggles.length - 1}
                        <div class="divider"></div>
                    {/if}
                </div>
            {/each}
        {/if}
    </Grid>
</Content>