<script lang="ts">
    import { Button, ButtonSet, Column, FileUploaderButton, FileUploaderItem, Grid, Row } from "carbon-components-svelte";
    import { DocumentAdd, Download } from "carbon-icons-svelte";
    import { Config } from "$lib/types/Config";

    import { toast } from "$lib/toast.svelte";
    import { config } from "$lib/config.svelte.js";
    import { isMobileDevice } from "$lib/util/misc";
    import { onMount } from "svelte";

    let isMobile: boolean = $state(false);

    let isProcessingFile: boolean = $state(false);
    let isHoldingFile: boolean = $state(false);
    let isFileError: boolean = $state(false);
    let isEditShown: boolean = $state(false);

    let filename: string = $state("");
    let errorSubject: string = $state("");
    let errorBody: string = $state("");

    onMount(() => {
        isMobile = isMobileDevice(window);
    });

    function getDownloadButtonStyle(): string {
        const marginLeft = `margin-left: ${ isMobile ? 0 : '1px' };`;
        const marginTop = `margin-top: ${ isMobile ? '1px' : 0 };`;
        const flexShrink = `flex-shrink: ${ isMobile ? 1 : 0 };`;

        return `${marginLeft} ${marginTop} ${flexShrink}`;
    }

    function handleFileUploader(event: CustomEvent<ReadonlyArray<File>>): void {
        if (Array.isArray(event.detail)) {
            isProcessingFile = true;

            event.detail.forEach((file: File) => {
                filename = file.name;
                isHoldingFile = true;

                readJsonFile(file)
                    .then(json => {
                        try {
                            isProcessingFile = false;

                            const parsed = Config.serializer.parse(json);
                            $config.courses = parsed.courses;

                            toast.emit("show", {
                                title: "Config Loaded",
                                subtitle: "Successfully processed config file."
                            });

                            setTimeout(() => {
                                isEditShown = true;
                            }, 3000);
                        } catch (error: unknown) {
                            const subject: string = "An error occurred while parsing config file";

                            if (error instanceof Error) {
                                setErrorMessage(subject + ":\n" + error.message);
                            } else {
                                setErrorMessage(subject);
                            }

                            toast.emit("show", {
                                kind: "error",
                                title: "Error",
                                subtitle: "An error occurred while parsing the given config file.",
                                timeout: 5000
                            });

                            console.log(error);
                        }
                    })
                    .catch(error => {
                        setErrorMessage();

                        toast.emit("show", {
                            kind: "error",
                            title: "Error",
                            subtitle: "An error occurred while loading the given config file.",
                            timeout: 5000
                        });

                        console.log(error);
                    });
            });
        }
    }

    function setErrorMessage(subject?: string): void {
        isFileError = true;
        isProcessingFile = false;
        errorSubject = subject ?? "An error occurred while reading config file";
        errorBody = "Please try a different config.";
    }

    function handleFileRemove(): void {
        filename = "";
        isHoldingFile = false;
        isFileError = false;
        isEditShown = false;
    }

    function getUploaderStatus(): "uploading" | "edit" | "complete" {
        if (isProcessingFile) {
            return "uploading";
        } else if (isEditShown || isFileError) {
            return "edit";
        } else {
            return "complete";
        }
    }

    function readJsonFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!(file instanceof File)) {
                reject(new Error("Provided object is not a valid File."));
            }

            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                try {
                    const jsonString = event.target?.result;
                    
                    if (typeof jsonString == "string") {
                        resolve(jsonString);
                    } else {
                        reject(new Error("File contained invalid data."));
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        reject(new Error(`Error reading config file data: ${error.message}`));
                    } else {
                        reject(new Error("An unknown error occurred."));
                    }
                }
            };

            reader.onerror = (error: ProgressEvent<FileReader>) => {
                if (error instanceof Error) {
                    reject(new Error(`Error occurred while reading config file: ${error.message}`));
                } else {
                    reject(new Error("An unknown error occurred while reading config file."));
                }
            };

            setTimeout(() => {
                reader.readAsText(file);
            }, 1000);
        });
    }
</script>

<style>
    :global(.bx--file__selected-file) {
        min-height: 2.7rem !important;
        margin-bottom: 0 !important;
    }
</style>

<Grid condensed style="padding: var(--cds-spacing-05, 1rem); padding-bottom: 0; padding-top: 0;">
    <Row>
        <Column sm={2} md={2} lg={2}>
            <h4 class="heading">Config File</h4>
            <p class="note">Only JSON files are accepted.</p>
        </Column>
        <Column>
            <ButtonSet stacked={isMobile}>
                {#if !isProcessingFile && !isHoldingFile}
                    <FileUploaderButton
                        kind="tertiary"
                        style="flex-shrink: 1; min-height: 2.7rem;"
                        icon={DocumentAdd}
                        labelText="Load file"
                        accept={[".json"]}
                        on:change={handleFileUploader}
                    />
                {:else}
                    <FileUploaderItem
                        style="flex-shrink: 1;"
                        {errorBody}
                        {errorSubject}
                        name={filename}
                        invalid={isFileError}
                        status={getUploaderStatus()}
                        on:delete={handleFileRemove}
                    />
                {/if}
                <Button
                    style={getDownloadButtonStyle() + "min-height: 2.7rem;"}
                    size="field"
                    kind="ghost"
                    icon={Download}
                    onclick={() => $config.download()}
                >
                    Download config
                </Button>
            </ButtonSet>
        </Column>
    </Row>
</Grid>

<div class="divider"></div>