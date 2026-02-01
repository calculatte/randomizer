<script lang="ts">
    import { Button } from "carbon-components-svelte";
    import { IbmWatsonDiscovery, Home } from "carbon-icons-svelte";
    import { Home as HomeRef } from "$lib/routes";
    import { page } from "$app/state";
</script>

<style>
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90vh;
        padding: 1rem;
        text-align: center;
    }

    code {
        font-size: 75%;
    }

    h1 {
        font-size: 5em;
        margin: 0;
    }

    p {
        font-size: 1.2em;
    }
</style>

<div class="error-container">
    {#if page.status === 404}
        <h1>Page Not Found</h1>
        <div style="scale: 2.2; margin-top: 32px; margin-bottom: 32px; margin-right: 2rem;">
            <IbmWatsonDiscovery size={32} />
        </div>
        <p>Did you know that <code class="code">12 x 2 + 64 x 3 + 284 - 48 x 2</code> is <code class="code">404</code>?</p>
        <p>Try looking for a different page.</p>
        <Button style="margin-top: 16px;" href={HomeRef} icon={Home}>Go Home</Button>
    {:else}
        <h1>{page.status}</h1>
        <p>{page.error?.message}</p>
        <Button style="margin-top: 16px;" href={HomeRef} icon={Home}>Go Home</Button>
    {/if}
</div>