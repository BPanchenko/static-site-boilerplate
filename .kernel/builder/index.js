import child_process from "node:child_process"

export const BUILDS = [
	['Scripts', () => child_process.fork('./.kernel/builder/scripts.js')],
	['Stylesheets', () => child_process.fork('./.kernel/builder/stylesheets.cjs')],
	['HTML', () => child_process.fork('./.kernel/builder/html.js')],
]

// 1. Cleaning up previous builds and copying resources

// 2. Synchronous source code building

BUILDS.forEach(async (
	[ref, build]) =>
		await new Promise((resolve) => build().on('exit', () => resolve()))
)

// 3. Update the site map