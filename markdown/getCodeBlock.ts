import type { Heading, Paragraph, RootContent } from 'mdast'
import { remark } from 'remark'

export const parseMarkdown2 = remark()

const isHeading = (child: RootContent): child is Heading =>
	child.type === 'heading'
const isParagraph = (child: RootContent): child is Paragraph =>
	child.type === 'paragraph'

const headingWithLevel = (
	children: RootContent[],
	level: number,
): Heading | undefined =>
	children.filter(isHeading).find(({ depth }) => depth === level)

export const getHeading = (
	markdown: string,
	level: number,
): Heading | undefined =>
	headingWithLevel(remark().parse(markdown).children, level)

// Find all the paragraphs immediately after the first headline with the given level
export const getParagraphsAfterHeading = (
	markdown: string,
	level: number,
): Paragraph[] => {
	let headingFound = false
	const paragraphs: Paragraph[] = []
	for (const child of remark().parse(markdown).children) {
		if (!headingFound && isHeading(child) && child.depth === level) {
			headingFound = true
			continue
		}
		if (!isParagraph(child)) break // once we reached a non-paragraph
		paragraphs.push(child)
	}
	return paragraphs
}
