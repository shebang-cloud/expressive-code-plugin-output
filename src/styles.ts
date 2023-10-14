import { StyleSettings, ExpressiveCodeTheme, ResolvedCoreStyles } from '@expressive-code/core'


export const outputClass = 'ec-ouput'

export const outputStyleSettings = new StyleSettings({
	outputColor: ({ coreStyles }) => coreStyles.codeForeground,
})

declare module '@expressive-code/core' {
	export interface StyleOverrides {
		output: Partial<typeof outputStyleSettings.defaultSettings>
	}
}

export function getOutputBaseStyles(theme: ExpressiveCodeTheme, coreStyles: ResolvedCoreStyles, styleOverrides: Partial<typeof outputStyleSettings.defaultSettings>) {
	const styles = outputStyleSettings.resolve({
		theme,
		coreStyles,
		styleOverrides,
		themeStyleOverrides: theme.styleOverrides.output,
	})
	const result = `
		.${outputClass} {
			color: ${styles.outputColor};
		}
	`
	return result
}
