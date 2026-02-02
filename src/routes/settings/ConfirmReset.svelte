<script lang="ts">
    import { Checkbox, ComposedModal, ModalBody, ModalFooter, ModalHeader } from "carbon-components-svelte";
    import { Home } from "$lib/routes";

    import { goto } from "$app/navigation";
    import { config } from "$lib/config.svelte";
    import { isResetOpen } from "./stores.svelte";

    let understood: boolean = $state(false);

    function handleReset(): void {
        $isResetOpen = false;
        $config.courses = [];

        goto(Home);
    }
</script>

<ComposedModal
    size="sm"
    bind:open={$isResetOpen}
    on:click:button--primary={handleReset}
    on:close={() => (understood = false)}
>
    <ModalHeader label="Reset" title="Confirm reset" />
    <ModalBody hasForm>
        <p style="margin-bottom: 16px;">
            You are about to reset your current application configuration.
            It is recommended to download your current config before proceeding.
        </p>
        <Checkbox bind:checked={understood} labelText="I understand that this action cannot be undone." />
    </ModalBody>
    <ModalFooter
        danger
        primaryButtonText="Reset"
        primaryButtonDisabled={!understood}
        secondaryButtonText="Cancel"
        on:click:button--secondary={() => ($isResetOpen = false)}
    />
</ComposedModal>