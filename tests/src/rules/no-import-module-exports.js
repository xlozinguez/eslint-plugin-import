'use strict'

const { RuleTester } = require('eslint')
const rule = require('./no-import-module-exports')

const parserOptions = { ecmaVersion: 6, sourceType: 'module' }
const error = {
	message: 'Cannot use import declarations in modules that export using CommonJS (`module.exports = \'foo\'` or `exports.bar = \'hi\'`)',
	type: 'ImportDeclaration',
}

const ruleTester = new RuleTester()
ruleTester.run('no-blockless-if', rule, {
	valid: [
		{
			code: `
				const thing = require('thing')
				module.exports = thing
			`,
			parserOptions,
		},
		{
			code: `
				import thing from 'otherthing'
				console.log(thing.module.exports)
			`,
			parserOptions,
		},
		{
			code: `
				import thing from 'other-thing'
				export default thing
			`,
			parserOptions,
		},
	],
	invalid: [
		{
			code: `
				import { stuff } from 'starwars'
				module.exports = thing
			`,
			errors: [error],
			parserOptions,
		},
		{
			code: `
				import thing from 'starwars'
				const baz = module.exports = thing
				console.log(baz)
			`,
			errors: [error],
			parserOptions,
		},
		{
			code: `
				import * as allThings from 'starwars'
				exports.bar = thing
			`,
			errors: [error],
			parserOptions,
		},
	],
})