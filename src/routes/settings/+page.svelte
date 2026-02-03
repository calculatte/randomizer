<script lang="ts">
    import { Button, Column, Row, Toggle } from "carbon-components-svelte";
    import { Settings, TrashCan } from "carbon-icons-svelte";
    import { type Setting } from "./types/Setting.ts";

    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { isResetOpen } from "./settings.svelte.ts";
    import { theme, midnight, notifyOnReload, developerMode } from "$lib/setting.svelte";

    import ConfirmReset from "./ConfirmReset.svelte";

    let mounted: boolean = $state(false);
    let toggles: Setting<boolean>[] = $state([]);

    toggles.push({
        title: "Dark mode",
        description: "Switch between light and dark mode.",
        get: () => $theme === "g90" || $theme === "g100",
        set: (state) => {
            if (state) {
                $theme = "g90";
            } else {
                $theme = "g10";
            }
        }
    });

    toggles.push({
        title: "Midnight theme",
        description: "Activate the midnight theme for dark mode.",
        get: () => $theme === "g100",
        set: (state) => {
            $midnight = state;

            if (state) {
                $theme = "g100";
            } else {
                $theme = "g90";
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

    function isSettingDisabled(setting: Setting<any>): boolean {
        return setting.disabled === undefined ? false : (typeof setting.disabled == 'function' ? setting.disabled() : setting.disabled);
    }

    onMount(() => {
        mounted = true;
    });
</script>

<style>
    :global(.bx--toggle__switch) {
        margin-top: 8px !important;
    }
</style>

<ConfirmReset />

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
    <div in:slide style="display: flex; margin-top: 8px; align-items: center;">
        <Button
            style="margin-top: 8px; margin-right: 8px;"
            kind="danger-tertiary"
            iconDescription="Reset"
            icon={TrashCan}
            on:click={() => ($isResetOpen = true)}
        />
        <div>
            <p class="heading" style="color: inerhit;">Clear config</p>
            <p class="note">Reset the config back to its default state.</p>
        </div>
    </div>

    <div in:slide class="divider"></div>

    {#each toggles as toggle}
        <div in:slide|global style="margin-top: 8px;">
            <Row>
                <Column>
                    <p
                        class="heading"
                        style:color={isSettingDisabled(toggle) ? "var(--cds-disabled-03)" : "inherit"}
                    >
                        {toggle.title}
                    </p>
                    <Toggle
                        labelText={toggle.description}
                        toggled={toggle.get()}
                        disabled={isSettingDisabled(toggle)}
                        on:toggle={e => toggle.set(e.detail.toggled)}
                    />
                </Column>
            </Row>
        </div>
    {/each}
{/if}