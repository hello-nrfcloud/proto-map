import type { RootContent } from 'mdast'
import { getHeading, getParagraphsAfterHeading } from './getCodeBlock.ts'

export const parseREADME = (
	markdown: string,
): {
	heading: string
	description: string[]
} => {
	const h1 = getHeading(markdown, 1)
	if (h1 === undefined) throw new Error(`No H1 defined!`)
	const descriptionParagraphs = getParagraphsAfterHeading(markdown, 1)

	if (descriptionParagraphs.length === 0)
		throw new Error(`No description defined!`)

	return {
		heading: toOneLine(nodeToString(h1)),
		description: descriptionParagraphs.map(nodeToString).map(toOneLine),
	}
}

const nodeToString = (node: RootContent): string => {
	if ('value' in node) return node.value
	if ('children' in node) return node.children.map(nodeToString).join('')
	return ''
}

const toOneLine = (s: string): string => s.trim().replaceAll('\n', ' ')
