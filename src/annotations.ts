import { ExpressiveCodeAnnotation, AnnotationBaseOptions, AnnotationRenderOptions, Parent, addClass } from '@expressive-code/core'
import { outputClass } from './styles'

export class OutputAnnotation extends ExpressiveCodeAnnotation {
	constructor(baseOptions : AnnotationBaseOptions) {
		super(baseOptions)
	}

	render({ nodesToTransform }: AnnotationRenderOptions): Parent[] {
		return this.renderFullLineMarker(nodesToTransform)
	}

	private renderFullLineMarker(nodesToTransform: Parent[] ): Parent[] {
		return nodesToTransform.map((node) => {
			addClass(node, outputClass)
			return node
		})
	}
}
