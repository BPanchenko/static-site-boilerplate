import coloring from "chalk"
import fs from "node:fs"
import path from "node:path"
import posthtml from "posthtml"
import { globSync } from "glob"
import { makeDirectorySync } from "make-dir"

import config from "../../.config/posthtml.config.cjs"

const hrstart = process.hrtime()

const files = globSync(config.input, { root: config.root }).map((file) => ({
	file,
	input: path.resolve(config.root, file),
	output: path.resolve(config.root, config.output, file)
}))

files.forEach(({ file, input, output }) => {
	const source = fs.readFileSync(input)
	
	posthtml(config.plugins)
		.process(source, { sync: false })
		.then(result => {
			makeDirectorySync(path.parse(output).dir)
			fs.writeFileSync(output, result.html)
			
			console.info(
				coloring.magenta(`Saved ${file} in %dms`),
				Math.round(process.hrtime(hrstart)[1] / 1000000)
			)
		})

	console.log(coloring.blue('Processing'), coloring.cyan(file))
})