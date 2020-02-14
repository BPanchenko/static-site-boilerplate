const glob = require('glob')
const path = require('node:path')
const { existsSync, mkdirSync } = require('node:fs')

const checkProductionMode = () => getEnvMode() === 'production'
const checkDevelopmentMode = () => getEnvMode() === 'development'

const getEnvMode = () => (`${process.env.NODE_ENV ?? 'development'}`).trim()

const getFilesByPattern = (pattern, ignore) => glob
.sync(Array.isArray(pattern) ? pattern.join(',') : pattern, {
  dot: false,
  ignore
}).map((file) => path.resolve(ROOT, file))

function checkFileDir(filePath) {
	const { dir } = path.parse(filePath)
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}
	return true
}

function debounce(func, timeout = 300){
	let timer;
	return (...args) => {
	  clearTimeout(timer);
	  timer = setTimeout(() => { func.apply(this, args); }, timeout);
	}
}

module.exports = {
	checkDevelopmentMode,
	checkFileDir,
	checkProductionMode,
	debounce,
	getEnvMode,
	getFilesByPattern
}