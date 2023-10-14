import { AttachedPluginData, ExpressiveCodePlugin, addClass, replaceDelimitedValues } from '@expressive-code/core'
import rangeParser from 'parse-numeric-range'
import { selectAll } from 'hast-util-select'
import { outputStyleSettings, getOutputBaseStyles, outputClass } from './styles'

export interface PluginOutputOptions {
	styleOverrides?: Partial<typeof outputStyleSettings.defaultSettings> | undefined
}

export function pluginOutput(options: PluginOutputOptions = {}): ExpressiveCodePlugin {
	return {
		name: 'Output',
		baseStyles: ({ theme, coreStyles, styleOverrides }) => getOutputBaseStyles(theme, coreStyles, { ...styleOverrides.output, ...options.styleOverrides }),
		hooks: {
			preprocessMetadata: ({ codeBlock }) => {
				codeBlock.meta = replaceDelimitedValues(
					codeBlock.meta,
					({ fullMatch, key, value }) => {
						// If we aren't interested in the entry, just return it as-is
						if (key !== 'output') return fullMatch

						const lineNumbers = rangeParser(value)
						const data = pluginOutputData.getOrCreateFor(codeBlock)
						data.lines = lineNumbers
						return ''
					},
					{
						valueDelimiters: ['"', "'", '/', '{...}'],
						keyValueSeparator: '=',
					}
				)
			},
			annotateCode: () => {
				return
			},
			postprocessRenderedBlock: ({ codeBlock, renderData }) => {
				const data = pluginOutputData.getOrCreateFor(codeBlock)
				if (data.lines.length == 0) {
					return
				}
				const lines = selectAll('pre > code div.ec-line', renderData.blockAst)
				data.lines.forEach((linenum) => {
					if (linenum >= lines.length) {
						return
					}
					const line = lines[linenum]
					addClass(line, outputClass)
					line.children.forEach((span) => {
						if (span.type === 'element' && span.properties) {
							span.properties.style = null
						}
					})
				})
			},
		},
	}
}

export const pluginOutputData = new AttachedPluginData<{ lines: number[] }>(() => ({ lines: [] }))
