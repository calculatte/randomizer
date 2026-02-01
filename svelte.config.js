import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompile: false,
			strict: true
		}),
		paths: {
			base: '/randomizer'
		}
	}
};

export default config;