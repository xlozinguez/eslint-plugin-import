'use strict'

module.exports = {
	meta: {
		docs: {
			description: 'Disallow import statements with module.exports',
			category: 'Best Practices',
			recommended: true,
		},
		fixable: 'code',
		schema: [],
	},
	create(context) {
		const importDeclarations = []
		let hasReported = false
		function report() {
			if (hasReported) {
				return
			}
			hasReported = true
			importDeclarations.forEach(node => {
				context.report({
					node,
					message: 'Cannot use import declarations in modules that export using CommonJS (`module.exports = \'foo\'` or `exports.bar = \'hi\'`)',
				})
			})
		}
		return {
			ImportDeclaration(node) {
				importDeclarations.push(node)
			},
			MemberExpression(node) {
				if (isModuleExports(node)) {
					report()
				}

				function isModuleExports(n) {
					return n.object.type === 'Identifier' && (/^(module|exports)$/).test(n.object.name)
				}
			},
		}
	},
}