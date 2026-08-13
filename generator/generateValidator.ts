import ts from 'typescript'
import type {
	ParsedLwM2MObjectDefinition,
	Resource,
} from '../lwm2m/ParsedLwM2MObjectDefinition.ts'
import { addDocBlock } from './addDocBlock.ts'
import { generateName } from './generateType.ts'

export const generateValidator = ({
	ObjectID,
	ObjectVersion,
	Name,
	Resources,
}: ParsedLwM2MObjectDefinition): ts.Node[] => {
	// import type { LwM2MObject } from './LwM2MObject.ts'
	const importLwM2MObject = ts.factory.createImportDeclaration(
		undefined,
		ts.factory.createImportClause(
			true,
			undefined,
			ts.factory.createNamedImports([
				ts.factory.createImportSpecifier(
					false,
					undefined,
					ts.factory.createIdentifier(`LwM2MObjectInstance`),
				),
			]),
		),
		ts.factory.createStringLiteral('../LwM2MObjectInstance.ts'),
	)
	/*
    import {
        NumberResource,
        TimeResource,
		OptionalResource,
        StringResource,
        validate,
    } from './validation.ts'
    */
	const importValidation = ts.factory.createImportDeclaration(
		undefined,
		ts.factory.createImportClause(
			false,
			undefined,
			ts.factory.createNamedImports(
				[...getResourceValidators({ Resources }), 'validateInstance'].map(
					(res) =>
						ts.factory.createImportSpecifier(
							false,
							undefined,
							ts.factory.createIdentifier(res),
						),
				),
			),
		),
		ts.factory.createStringLiteral('../validation.ts'),
	)
	// import type { Geolocation_14201 } from './objects.ts'
	const name = generateName({ Name, ObjectID })
	const importObjectType = ts.factory.createImportDeclaration(
		undefined,
		ts.factory.createImportClause(
			true,
			undefined,
			ts.factory.createNamedImports([
				ts.factory.createImportSpecifier(
					false,
					undefined,
					ts.factory.createIdentifier(name),
				),
			]),
		),
		ts.factory.createStringLiteral('../objects.ts'),
	)
	// import { LwM2MObjectID } from './LwM2MObjectID.ts'
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
		ts.factory.createStringLiteral('../LwM2MObjectID.ts'),
	)

	// validate ...
	const validate = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(`validate${ObjectID}`),
					undefined,
					undefined,
					ts.factory.createArrowFunction(
						undefined,
						undefined,
						[
							ts.factory.createParameterDeclaration(
								undefined,
								undefined,
								ts.factory.createIdentifier('o'),
								undefined,
								ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
							),
						],
						ts.factory.createUnionTypeNode([
							ts.factory.createTypeLiteralNode([
								ts.factory.createPropertySignature(
									undefined,
									ts.factory.createIdentifier('error'),
									undefined,
									ts.factory.createTypeReferenceNode(`Error`),
								),
							]),
							ts.factory.createTypeLiteralNode([
								ts.factory.createPropertySignature(
									undefined,
									ts.factory.createIdentifier('object'),
									undefined,
									ts.factory.createTypeReferenceNode(
										ts.factory.createIdentifier('LwM2MObjectInstance'),
										[
											ts.factory.createTypeReferenceNode(
												ts.factory.createIdentifier(name),
											),
										],
									),
								),
							]),
						]),
						undefined,
						ts.factory.createCallExpression(
							ts.factory.createCallExpression(
								ts.factory.createIdentifier('validateInstance'),
								[
									ts.factory.createTypeReferenceNode(
										ts.factory.createIdentifier(name),
									),
								],
								[
									ts.factory.createPropertyAccessExpression(
										ts.factory.createIdentifier('LwM2MObjectID'),
										ts.factory.createIdentifier(name),
									),
									ts.factory.createStringLiteral(ObjectVersion ?? '1.0'),
									ts.factory.createObjectLiteralExpression(
										(Array.isArray(Resources.Item)
											? Resources.Item
											: [Resources.Item]
										).map((Resource) => {
											const validator = ts.factory.createPropertyAssignment(
												ts.factory.createNumericLiteral(Resource.$.ID),
												toResourceValidator(Resource),
											)

											return validator
										}),
									),
								],
							),
							undefined,
							[ts.factory.createIdentifier('o')],
						),
					),
				),
			],
			ts.NodeFlags.Const,
		),
	)
	addDocBlock(
		[
			`Validate ${Name} (${ObjectID})`,
			``,
			`Ensures the given object is an LwM2M object according to the schema ${ObjectID}.xml.`,
		],
		validate,
	)

	return [
		importLwM2MObject,
		importValidation,
		importObjectType,
		importLwM2MObjectID,
		validate,
	]
}

const toResourceValidator = (Resource: Resource): ts.Expression => {
	let valueValidator: ts.Expression = ts.factory.createIdentifier(
		typeToValidator(Resource.Type),
	)
	if (Resource.MultipleInstances === 'Multiple') {
		valueValidator = ts.factory.createCallExpression(
			ts.factory.createIdentifier('MultipleInstanceResource'),
			undefined,
			[valueValidator],
		)
	}
	if (Resource.Mandatory === 'Optional')
		return ts.factory.createCallExpression(
			ts.factory.createIdentifier('OptionalResource'),
			undefined,
			[valueValidator],
		)

	return valueValidator
}

const typeToValidator = (Type: Resource['Type']): string => {
	switch (Type) {
		case 'String':
		case 'Opaque':
			return 'StringResource'
		case 'Float':
		case 'Integer':
			return 'NumberResource'
		case 'Boolean':
			return 'BooleanResource'
		case 'Time':
			return 'TimeResource'
		default:
			throw new Error(`Unsupported Resource type ${Type as string}!`)
	}
}

const getResourceValidators = ({
	Resources,
}: Pick<ParsedLwM2MObjectDefinition, 'Resources'>): Set<string> =>
	new Set(
		(Array.isArray(Resources.Item) ? Resources.Item : [Resources.Item])
			.map(({ Type, Mandatory, MultipleInstances }) => [
				typeToValidator(Type),
				Mandatory === 'Optional' ? 'OptionalResource' : undefined,
				MultipleInstances === 'Multiple'
					? 'MultipleInstanceResource'
					: undefined,
			])
			.flat()
			.filter((d) => d !== undefined),
	)
