import { parseREADME } from 'markdown/parseREADME.js'
import ts from 'typescript'
import { addDocBlock } from './addDocBlock.js'
import { tokenizeName } from './tokenizeName.js'

export const generateModels = (
	models: {
		id: string
		readmeMarkdown: string
	}[],
): ts.Node[] => {
	const types: ts.Node[] = []

	types.push(
		addDocBlock(
			['The Model IDs defined in this repo.'],
			ts.factory.createEnumDeclaration(
				[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
				ts.factory.createIdentifier('ModelID'),
				models.map(({ id }) =>
					ts.factory.createEnumMember(
						tokenizeName(id),
						ts.factory.createStringLiteral(id),
					),
				),
			),
		),
	)

	types.push(
		ts.factory.createTypeAliasDeclaration(
			[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
			ts.factory.createIdentifier('Model'),
			undefined,
			ts.factory.createTypeLiteralNode([
				addDocBlock(
					['The Model ID'],
					ts.factory.createPropertySignature(
						undefined,
						ts.factory.createStringLiteral('id'),
						undefined,
						ts.factory.createTypeReferenceNode('ModelID'),
					),
				),
				addDocBlock(
					['Description of the Model from the README.md'],
					ts.factory.createPropertySignature(
						undefined,
						ts.factory.createStringLiteral('about'),
						undefined,
						ts.factory.createTypeLiteralNode([
							addDocBlock(
								['The text of the H1 headline'],
								ts.factory.createPropertySignature(
									undefined,
									ts.factory.createStringLiteral('title'),
									undefined,
									ts.factory.createTypeReferenceNode('string'),
								),
							),
							addDocBlock(
								['The text of the paragraphs following the H1 headline'],
								ts.factory.createPropertySignature(
									undefined,
									ts.factory.createStringLiteral('description'),
									undefined,
									ts.factory.createTypeReferenceNode('string'),
								),
							),
						]),
					),
				),
			]),
		),
	)

	types.push(
		addDocBlock(
			['The models defined for hello.nrfcloud.com'],
			ts.factory.createVariableStatement(
				[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
				ts.factory.createVariableDeclarationList(
					[
						ts.factory.createVariableDeclaration(
							ts.factory.createIdentifier(`models`),
							undefined,
							ts.factory.createTypeReferenceNode('Readonly', [
								ts.factory.createTypeReferenceNode('Record', [
									ts.factory.createTypeReferenceNode('ModelID', []),
									ts.factory.createTypeReferenceNode('Model', []),
								]),
							]),
							ts.factory.createAsExpression(
								ts.factory.createObjectLiteralExpression(
									models.map((model) => {
										const readme = parseREADME(model.readmeMarkdown)
										return ts.factory.createPropertyAssignment(
											ts.factory.createComputedPropertyName(
												ts.factory.createPropertyAccessExpression(
													ts.factory.createIdentifier('ModelID'),
													ts.factory.createIdentifier(tokenizeName(model.id)),
												),
											),
											// The model object
											ts.factory.createObjectLiteralExpression([
												// id
												ts.factory.createPropertyAssignment(
													ts.factory.createStringLiteral('id'),
													ts.factory.createPropertyAccessExpression(
														ts.factory.createIdentifier('ModelID'),
														ts.factory.createIdentifier(tokenizeName(model.id)),
													),
												),
												// About
												ts.factory.createPropertyAssignment(
													ts.factory.createStringLiteral('about'),
													ts.factory.createObjectLiteralExpression([
														ts.factory.createPropertyAssignment(
															ts.factory.createStringLiteral('title'),
															ts.factory.createStringLiteral(readme.heading),
														),
														ts.factory.createPropertyAssignment(
															ts.factory.createStringLiteral('description'),
															ts.factory.createStringLiteral(
																readme.description.join('\n'),
															),
														),
													]),
												),
											]),
										)
									}),
								),
								ts.factory.createTypeReferenceNode('const'),
							),
						),
					],
					ts.NodeFlags.Const,
				),
			),
		),
	)

	return types
}
