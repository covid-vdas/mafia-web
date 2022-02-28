/** @type {import('@sveltejs/kit').Config} */

import { defineConfig } from 'vite'
import path from 'path';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias:{
					'components': path.resolve('src/components'),
                    'utils': path.resolve('src/utils')
				}
			}
		}
		
	}
};

export default config;
