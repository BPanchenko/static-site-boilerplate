const path = require('node:path')
const { readFileSync, writeFileSync } = require('node:fs')
const postcss = require('postcss')

const config = require("../../.config/postcss.config.cjs")
const logger = require('../logger.cjs')
const { getFilesByPattern } = require('../lib.cjs')

const { dirs, root } = require("../../.config/workspace.config.cjs")

const getTarget = (filePath) => {
	const { name } = path.parse(filePath);
	const targetPath = `${dirs.stylesheets}${name === 'main' ? '' : '-' + name}.css`;
	return path.join(root, config.output, targetPath);
}

{
	const promises = getFilesByPattern(config.input).map((source) => {
		const target = getTarget(source)
		const rawCss = readFileSync(source, { flag: 'r' })
	  
		checkFileDir(target)

		return postcss(config.plugins)
		  .process(rawCss, { from: source, to: target })
		  .then((result) => {
			writeFileSync(target, result.css, { flag: 'w' })
	  
			const relative = target.replace(root, '').replace(/^\\/, '')
			logSuccess(relative)
		  })
		  .catch((error) => {
			logError(error)
		  })
	})
	  
	Promise.allSettled(promises).then((results) => {
		logger.logSummaryFiles(results)
	})
}
