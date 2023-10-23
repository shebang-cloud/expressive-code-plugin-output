import { AttachedPluginData, ExpressiveCodePlugin, replaceDelimitedValues } from '@expressive-code/core'
import rangeParser from 'parse-numeric-range'
import { outputStyleSettings, getOutputBaseStyles } from './styles'
import { OutputAnnotation } from './annotations'
import { InlineStyleAnnotation } from '@expressive-code/core'

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
			annotateCode: ({ codeBlock }) => {
				const data = pluginOutputData.getOrCreateFor(codeBlock)
				data.lines.forEach((lineNumber) => {
					codeBlock.getLine(lineNumber)?.addAnnotation(new OutputAnnotation({}))
				})
			},
			postprocessAnnotations: ({ codeBlock }) => {
				const data = pluginOutputData.getOrCreateFor(codeBlock)
				data.lines.forEach((lineNumber) => {
					const line = codeBlock.getLine(lineNumber)
					line?.getAnnotations().forEach((ann) => {
						if (ann instanceof InlineStyleAnnotation) {
							line.deleteAnnotation(ann);
						}
					})
				})
			},
		},
	}
}

export const pluginOutputData = new AttachedPluginData<{ lines: number[] }>(() => ({ lines: [] }))
