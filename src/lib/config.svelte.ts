import { type Persisted, persisted } from "svelte-persisted-store";
import { Config } from "$lib/types/Config";
import { toast } from "$lib/toast.svelte";

export const config: Persisted<Config> = persisted("config", new Config(), {
    serializer: Config.serializer,
    syncTabs: true,
    onWriteError: (error) => {
        console.error("Error when writing config persistence", error);

        if (error != null && typeof error == "object") {
            let message = (error as Error).message;

            if (message != null) {
                toast.emit("show", { kind: "error", title: "Error", subtitle: message });
            }
        }
    },
    onParseError: (raw, error) => {
        console.error("Error when parsing config restore", error, raw);

        if (error != null && typeof error == "object") {
            let message = (error as Error).message;

            if (message != null) {
                toast.emit("show", { kind: "error", title: "Error", subtitle: message });
            }
        }
    }
});
