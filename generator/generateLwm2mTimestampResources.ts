import ts from 'typescript'
import { addDocBlock } from './addDocBlock.ts'

export const generateLwm2mTimestampResources = (
	timestampResources: Record<string, number>,
): ts.Node[] => {
	const importLwM2MObjectID = ts.factory.createImportDeclaration(
		undefined,
		ts.factory.createImportClause(
			false,
			undefined,
			ts.factory.createNamedImports([
				ts.factory.createImportSpecifier(
					false,
					undefined,
					ts.factory.createIdentifier(`LwM2MObjectID`),
				),
			]),
		),
		ts.factory.createStringLiteral('./LwM2MObjectID.ts'),
	)

	const type = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(`timestampResources`),
					undefined,
					ts.factory.createTypeReferenceNode('Readonly', [
						ts.factory.createTypeReferenceNode('Map', [
							ts.factory.createTypeReferenceNode('LwM2MObjectID'),
							ts.factory.createTypeReferenceNode('number'),
						]),
					]),
					ts.factory.createNewExpression(
						ts.factory.createIdentifier('Map'),
						[
							ts.factory.createTypeReferenceNode('LwM2MObjectID'),
							ts.factory.createTypeReferenceNode('number'),
						],
						[
							ts.factory.createArrayLiteralExpression(
								Object.entries(timestampResources).map(([k, v]) =>
									ts.factory.createArrayLiteralExpression([
										ts.factory.createPropertyAccessExpression(
											ts.factory.createIdentifier('LwM2MObjectID'),
											ts.factory.createIdentifier(k),
										),
										ts.factory.createNumericLiteral(v),
									]),
								),
							),
						],
					),
				),
			],
			ts.NodeFlags.Const,
		),
	)
	addDocBlock(
		[
			'Contains the ID of the resource that defines the timestamp for each LwM2M object definition',
		],
		type,
	)

	return [importLwM2MObjectID, type]
}
