import fs from "node:fs"
import path from "node:path"
import dateFormat from "date-format"
import { globSync } from "glob"
import { create } from "xmlbuilder2"

import config from "../../.config/posthtml.config.cjs"
import { dirs, root } from "../../.config/workspace.config.cjs"

const BASE = "http://website.domain"
const FILE = "sitemap.xml"

const xml = create({
	encoding: 'UTF-8',
	version: '1.0'
}).ele('urlset', {
	xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
});

{
	const urlset = globSync(config.input, { root })
		.map(relative => ({
			stats: fs.statSync(path.resolve(root, relative)),
			url: new URL(
				relative.replace('index.html', ''),
				BASE
			)
		}))

	urlset.forEach(
		({ stats, url }) =>
			xml.ele('url')
				.ele('loc').txt(url).up()
				.ele('lastmod').txt(dateFormat('yyyy-MM-dd', stats.mtime)).up()
	)
}

{
	const content = xml.end({ prettyPrint: true })
	const output = path.resolve(root, dirs.dist, FILE)

	fs.writeFileSync(output, content)
}