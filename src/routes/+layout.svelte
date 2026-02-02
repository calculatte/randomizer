<script lang="ts">
	import { Column, Content, Grid, Row } from 'carbon-components-svelte';
	import { Settings } from "$lib/routes";
	import { page } from "$app/state";
	import favicon from '$lib/assets/favicon.svg';
	import App from '$lib/components/App.svelte';
    import Config from './Config.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<App />
<Content>
	<Grid padding>
		<Row style={page.url.pathname !== Settings ? '' : 'display: none;'}>
			<Column>
				<Config />
			</Column>
		</Row>
		<Row>
			<Column>
				{@render children()}
			</Column>
		</Row>
	</Grid>
</Content>
