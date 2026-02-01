<script lang="ts">
    import { NotificationQueue } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { toast } from "$lib/toast.svelte";

    let queue: NotificationQueue | undefined = $state(undefined);

    onMount(() => {
        const unsubscribe = toast.subscribe("show", (event) => {
            const data = event.detail;

            if (typeof queue == "undefined") {
                return;
            }

            const uuid = crypto.randomUUID();
            const timeout = data.timeout ? data.timeout : 3000;

            queue.add({
                id: uuid,
                timeout: timeout,
                kind: data.kind ? data.kind : "info",
                title: data.title,
                subtitle: data.subtitle,
                caption: data.caption
            });

            setTimeout(() => {
                const element = document.getElementById(uuid);

                if (element != null) {
                    element.classList.add("fade");
                }
            }, timeout - 500);
        });

        return () => {
            unsubscribe();
        }
    });
</script>

<style>
    :global(.bx--toast-notification) {
        opacity: 0;
        animation-name: fadeIn;
        animation-duration: 0.5s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
    }

    :global(.bx--toast-notification.fade) {
        opacity: 1;
        animation-name: fadeOut;
        animation-duration: 0.5s;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        pointer-events: none;
    }

    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }
</style>

<div id="toast-queue">
    <NotificationQueue bind:this={queue} on:close={(e) => {console.log(e);}} />
</div>
