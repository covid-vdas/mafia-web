/** @type {import('@sveltejs/kit').Config} */

import { defineConfig } from 'vite'

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
