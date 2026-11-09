import ts from 'typescript'

/**
 * Creates an enum-like `as const` object and a type alias of the same name
 * containing the union of its values.
 *
 * Enums are not supported by the TypeScript type stripping in Node.js.
 *
 * export const Name = { A: 'a', B: 'b' } as const
 * export type Name = (typeof Name)[keyof typeof Name]
 */
export const createConstEnum = (
	name: string,
	members: ts.PropertyAssignment[],
): [ts.VariableStatement, ts.TypeAliasDeclaration] => [
	ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(name),
					undefined,
					undefined,
					ts.factory.createAsExpression(
						ts.factory.createObjectLiteralExpression(members, true),
						ts.factory.createTypeReferenceNode('const'),
					),
				),
			],
			ts.NodeFlags.Const,
		),
	),
	ts.factory.createTypeAliasDeclaration(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createIdentifier(name),
		undefined,
		ts.factory.createIndexedAccessTypeNode(
			ts.factory.createParenthesizedType(
				ts.factory.createTypeQueryNode(ts.factory.createIdentifier(name)),
			),
			ts.factory.createTypeOperatorNode(
				ts.SyntaxKind.KeyOfKeyword,
				ts.factory.createTypeQueryNode(ts.factory.createIdentifier(name)),
			),
		),
	),
]
