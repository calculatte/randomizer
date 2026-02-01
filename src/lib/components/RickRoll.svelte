<script lang="ts">
    import {
        ComposedModal,
        InlineNotification,
        ModalBody,
        ModalHeader,
        Portal
    } from "carbon-components-svelte";

    import { slide } from "svelte/transition";
    import rickrolled from "$lib/assets/videos/rickrolled.mp4";

    let { open } = $props();
    let hasSeen: boolean = $state(false);
    let isPlaying: boolean = $state(false);
    let video: HTMLVideoElement | undefined = $state(undefined);

    function handleVideoStart(): void {
        isPlaying = true;
    }

    function closeModal(): void {
        open = false;
        hasSeen = true;

        if (video != undefined) {
            video.pause();
        }
    }
</script>

<style>
    :global(.rick-roll) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    :global(.rick-roll p) {
        margin-top: 8px;
        width: 50%;
        text-align: center;
    }

    :global(.rick-roll video) {
        width: 640px;
        height: 480px;
    }

    :global(.responsive-video) {
        max-width: 100%;
        height: auto;
    }
</style>

<Portal>
    <ComposedModal
        bind:open
        on:click:button--primary={closeModal}
        on:close={closeModal}
    >
        <ModalHeader title={isPlaying ? "Rick Rolled 😂" : "Debug Results"}/>
        <ModalBody>
            <div class="rick-roll">
                <video
                    class="responsive-video"
                    bind:this={video}
                    onplaying={handleVideoStart}
                    autoplay={!hasSeen}
                    controls
                    loop
                >
                    <source src={rickrolled} type="video/mp4" />
                    Your browser does not support playing embedded videos. Lucky you for avoiding the rick roll!
                </video>
                <div class="divider" style="width: 100%;"></div>
            </div>
            {#if isPlaying}
                <div in:slide style="display: flex; justify-content: center;">
                    <InlineNotification
                        lowContrast
                        hideCloseButton
                        kind="warning-alt"
                        title="Whoops:"
                        subtitle="You just got Rick Rolled! Don't worry, this won't happen again until the next time you open the app!"
                        style="max-width: fit-content;"
                    />
                </div>
            {/if}
        </ModalBody>
    </ComposedModal>
</Portal>
