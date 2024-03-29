(() => {

	const el = wp.element.createElement;

	wp.blocks.registerBlockType( blockName, {
		title,
        icon: iconSrc
			? el('img', {
				src: iconSrc,
				alt: title,
				width: 20,
				height: 20,
			})
			: 'columns',
		category: 'widgets',

		attributes: {
			buttonText: {
				type: 'string',
				default: 'Pro & Contra anzeigen',
			},
			id: {
				type: 'string',
				default: '',
			}
		},

        supports: {
        },

		edit: props => {
			props.attributes.id = `${prefix}${Math.random().toString(36).substring(2, 11)}`;
			return el( 'div',
				{ className: `${props.className} ${prefix}main` },
				el('label', {className: `${prefix}label`}, props.attributes.buttonText),
				el('div', {className: `${prefix}content`},
					el( wp.blockEditor.InnerBlocks, {
						allowedBlocks: [
							'core/heading', 'core/paragraph', 'core/list', 'core/buttons', 'core/spacer', 'core/table', 'core/separator', 'core/spacer'
						],
						template: [
							[ 'core/paragraph', {} ],
							[ 'core/list', { ordered: false, values: ['', ''] } ]
						],
						templateLock: false
					}),
				),
				el( wp.element.Fragment, // sidebar
				{},
				el( wp.blockEditor.InspectorControls, {},
					el( wp.components.PanelBody, {},
						el( wp.components.TextControl, {
							label: 'Button text',
							value: props.attributes.buttonText || '',
							onChange: value => {
								props.setAttributes( { buttonText: value } );
							},
						}),
					)
				)
			)
			);
		},
		save: props => {
            return el( 'div',
				{ className: `${prefix}main` },
				el('input', {type: 'checkbox', className: `${prefix}trigger`, id: props.attributes.id} ),
				el('label', {className: `${prefix}label`, htmlFor: props.attributes.id}, props.attributes.buttonText),
				el('div', {className: `${prefix}content`},
					el( wp.blockEditor.InnerBlocks.Content ),
				),
            );
		},
	} );
})();