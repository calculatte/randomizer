import { type Writable, writable } from "svelte/store";
import { type Persisted, persisted } from "svelte-persisted-store";
import type { CarbonTheme } from "carbon-components-svelte/src/Theme/Theme.svelte";

export const theme: Writable<CarbonTheme> = writable<CarbonTheme>("g10");
export const loaded: Writable<boolean> = writable();
export const notifyOnReload: Writable<boolean> = writable(true);
export const developerMode: Writable<boolean> = writable(false);
export const midnight: Persisted<boolean> = persisted("midnight_theme", false, { syncTabs: true });
export const showReload: Persisted<boolean> = persisted("show_reload", true, { syncTabs: true });