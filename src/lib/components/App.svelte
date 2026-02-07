<script lang="ts">
    import "carbon-components-svelte/css/all.css";

    import {
        Header,
        HeaderNav,
        HeaderNavItem,
        HeaderUtilities,
        SkipToContent,
        SideNav,
        SideNavItems,
        SideNavLink,
        SideNavDivider,
        Theme
    } from "carbon-components-svelte";

    import {
        ChangeCatalog,
        SettingsEdit,
        IbmKnowledgeCatalog
    } from "carbon-icons-svelte";

    import { Home, Courses, Settings } from "$lib/routes";
    import DownloadConfig from "$lib/components/DownloadConfig.svelte";
    import LightSwitch from "$lib/components/LightSwitch.svelte";
    import Debug from "$lib/components/Debug.svelte";
    import Toast from "$lib/components/Toast.svelte";

    import { page } from "$app/state";
    import { theme } from "$lib/setting.svelte";
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";

    onMount(() => {
        let saved = localStorage.getItem("__app-theme");

        if (saved == "white" || saved == "g10" || saved == "g80" || saved == "g90" || saved == "g100") {
            $theme = saved;
        }
    });

    let isSideNavOpen: boolean = $state(false);

    function isActive(href: string): boolean {
        return page.url.pathname === href;
    }

    function fadeInOut(node: HTMLElement, { duration }: { duration: number }) {
        // 240ms cubic-bezier(0.2, 0, 0.38, 0.9)
        const o = +getComputedStyle(node).opacity;

        return {
            duration,
            css: (t: number) => {
                const cubic = cubicInOut(t)

                return `opacity: ${t * o * cubic}`
            }
        };
    }
</script>

<style>
    :global(.divider) {
        margin-top: var(--cds-spacing-05, 1rem);
        border: none;
        border-top: 1px solid var(--cds-border-subtle);
    }

    :global(.code) {
        font-size: var(--cds-code-01-font-size);
        font-weight: var(--cds-code-01-font-weight);
        letter-spacing: var(--cds-code-01-letter-spacing);
        line-height: var(--cds-code-01-line-height);
    }

    :global(.title) {
        font-size: 2.1rem;
        font-weight: 400;
        letter-spacing: var(--cds-code-01-letter-spacing);
        color: var(--cds-text-primary, #161616)
    }

    :global(.heading) {
        font-size: var(--cds-productive-heading-03-font-size, 1.25rem);
        font-weight: var(--cds-productive-heading-03-font-weight, 400);
        line-height: var(--cds-productive-heading-03-line-height, 1.4);
        letter-spacing: var(--cds-productive-heading-03-letter-spacing, 0);
        color: var(--cds-text-primary, #161616);
    }

    :global(.subheading) {
        font-size: var(--cds-body-short-01-font-size, 0.875rem);
        font-weight: var(--cds-body-short-01-font-weight, 400);
        line-height: var(--cds-body-short-01-line-height, 1.28572);
        letter-spacing: var(--cds-body-short-01-letter-spacing, 0.16px);
        color: var(--cds-text-secondary, #525252);
    }

    :global(.note) {
        color: var(--cds-text-02, #525252);
        font-size: var(--cds-helper-text-01-font-size, 0.75rem);
    }

    :global(.animated-sidenav) {
        transition: transform 240ms cubic-bezier(0.2, 0, 0.38, 0.9);
    }

    /* Allows the side nav transition animation to play */
    :global(.bx--side-nav--ux) {
        visibility: visible !important;
    }

    /* Keeps the side nav from content to the right when opened */
    :global(.bx--content) {
        margin-left: 0 !important;
    }

    /* Provide our own transition background for the side nav */
    :global(.sidebar-background) {
        position: fixed;
        top: var(--cds-spacing-09, 3rem);
        bottom: 0;
        width: 100%;
        z-index: 1000;
        background-color: var(--cds-overlay-01, rgba(22, 22, 22, 0.5));
    }

    /* Disable carbon background since its transition is broken */
    @media (max-width: 65.98rem) {
        :global(.bx--side-nav__overlay-active) {
            opacity: 0 !important;
        }
    }

    :global(.bx--radio-button-wrapper) {
        z-index: 3;
    }

    :global(.bx--header__name) {
        padding-left: 0 !important;
    }

    :root[theme="g90"][theme="g100"] {
        :global(.rangeSlider) {
            --range-handle-inactive: color-mix(in srgb, var(--cds-ui-05) 100%, black 10%);
        }
    }

    :root[theme="g10"] {
        :global(.rangeSlider) {
            --range-handle-inactive: color-mix(in srgb, var(--cds-ui-05) 100%, white 10%);
        }
    }

    :global(.rangeSlider) {
        --range-slider:                var(--cds-ui-03);

        --range-handle:                var(--cds-ui-05);
        --range-handle-focus:          var(--cds-ui-05);
        --range-handle-border:         var(--cds-border-subtle-selected);

        --range-range-inactive:        var(--cds-button-primary-hover);
        --range-range:                 var(--cds-button-primary);
        --range-range-hover:           var(--cds-ui-05);
        --range-range-limit:           var(--cds-ui-04);

        --range-float-inactive:        var(--cds-ui-01);
        --range-float:                 var(--cds-ui-01);
        --range-float-text:            var(--cds-text-01);

        --range-pip:                   var(--cds-text-03);
        --range-pip-text:              var(--cds-text-01);
        --range-pip-active:            var(--cds-text-01);
        --range-pip-active-text:       var(--cds-text-01);
        --range-pip-hover:             var(--cds-text-01);
        --range-pip-hover-text:        var(--cds-text-01);
        --range-pip-in-range:          var(--cds-text-01);
        --range-pip-in-range-text:     var(--cds-text-01);
        --range-pip-out-of-limit:      var(--cds-text-02);
        --range-pip-out-of-limit-text: var(--cds-text-02);
    }
</style>

<Theme theme={$theme} persist persistKey="__app-theme" />

<Header bind:isSideNavOpen persistentHamburgerMenu={true}>
    <span slot="platform">
        Homework Randomizer
        <code class="code" style="margin-left: 4px;">v0.0.12</code>
    </span>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>

    <HeaderNav>
        <HeaderNavItem isSelected={isActive(Home)} href={Home} text="Randomizer" />
        <HeaderNavItem isSelected={isActive(Courses)} href={Courses} text="Courses" />
        <HeaderNavItem isSelected={isActive(Settings)} href={Settings} text="Settings" />
    </HeaderNav>

    <HeaderUtilities>
        <DownloadConfig />
        <LightSwitch />
        <Debug />
    </HeaderUtilities>
</Header>

<Toast />

{#if isSideNavOpen}
    <div class="sidebar-background" transition:fadeInOut|local={{ duration: 240 }}></div>
{/if}

<SideNav bind:isOpen={isSideNavOpen} class="animated-sidenav">
    <SideNavItems>
        <SideNavLink icon={ChangeCatalog} isSelected={isActive(Home)} href={Home}>Randomizer</SideNavLink>
        <SideNavDivider />
        <SideNavLink icon={IbmKnowledgeCatalog} isSelected={isActive(Courses)} href={Courses}>Courses</SideNavLink>
        <SideNavLink icon={SettingsEdit} isSelected={isActive(Settings)} href={Settings}>Settings</SideNavLink>
    </SideNavItems>
</SideNav>
