import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'
import copy from 'rollup-plugin-copy'

export default args => {
	const dest = `scorm/builds/${encodeURIComponent(args.name).toLowerCase()}/`
	return {
		input: 'scorm/src/entry.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'app',
			file: dest + 'bundle.js',
			extend: true
		},
		plugins: [
			svelte({
				dev: false,
				css: css => css.write(dest + 'bundle.css', false) // false = no sourceMap
			}),
			resolve({
				browser: false,
				dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
				preferBuiltins: true
			}),
			copy({
				targets: [
					{src: 'scorm/templates/index.html', dest},
					{src: 'scorm/templates/pipwerks.js', dest},
					{src: 'public/global.css', dest},
					{src: 'public/reset.css', dest},
					{src: 'public/Roboto-Regular.ttf', dest},
					{src: 'public/Roboto-Bold.ttf', dest}
				]
			}),
			commonjs(),
			terser(),
			json(),
			nodeGlobals(),
			builtins()
		]
	}
}