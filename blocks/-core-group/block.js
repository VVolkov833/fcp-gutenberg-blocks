(() => {

    const effected_blocks = ['core/group'];

    const addClass = (classNames, classNameToAdd) => {
        const classes = classNames?.split(' ') || [];
        if (!hasClass(classNameToAdd)) {
            classes.push(classNameToAdd);
        }
        return [...new Set(classes)].join(' ');
    };

    const removeClass = (classNames, classNameToRemove) => {
        const classes = classNames?.split(' ') || [];
        const index = classes.indexOf(classNameToRemove);
        if (~index) {
            classes.splice(index, 1);
        }
        return classes.join(' ');
    };

    const hasClass = (classNames, classNameToCheck) => {
        const classes = classNames?.split(' ') || [];
        if (classes.includes(classNameToCheck)) { return true }
        return false;
    };

    // add the control / input
    const el = wp.element.createElement;
    const toggle = (props, name, label) => {
        return (props.isSelected && ~effected_blocks.indexOf(props.name)) ? (
            el(wp.blockEditor.InspectorControls, {},
                el(wp.components.PanelBody, {},
                    el(wp.components.ToggleControl, {
                        label: label,
                        checked: hasClass(props.attributes.className, name),
                        onChange: () => {
                            const addRemoveClass = hasClass(props.attributes.className, name) ? removeClass : addClass;
                            const newClassName = addRemoveClass(props.attributes.className, name);
                            props.setAttributes({ className: newClassName });
                        }
                    })
                )
            )
        ) : null
    };
    const select = (props, label, options) => {
        const getClassName = () => {
            const classes = (props.attributes.className?.split(' ') || []).filter(Boolean);
            for (const className of classes) {
                const matchedOption = options.find(option => option.value === className);
                if (matchedOption) {
                    return matchedOption.value;
                }
            }
            return '';
        };

        return (
            props.isSelected && ~effected_blocks.indexOf(props.name) ? (
                el(
                    wp.blockEditor.InspectorControls,
                    {},
                    el(
                        wp.components.PanelBody,
                        {},
                        el(wp.components.SelectControl, {
                            label: label,
                            value: getClassName(),
                            options: options,
                            onChange: newValue => {
                                let clearedClassName = props.attributes.className;
                                options.forEach(option => {
                                    clearedClassName = removeClass(clearedClassName, option.value);
                                });
                                const newClassName = addClass(clearedClassName, newValue && newValue || '');
                                props.setAttributes({ className: newClassName });
                            },
                        })
                    )
                )
            ) : null
        );
    };


    wp.hooks.addFilter(
        'editor.BlockEdit',
        blockName + '-control',
        wp.compose.createHigherOrderComponent( BlockEdit => {
            return props => {
                return el(
                    wp.element.Fragment,
                    {},
                    el(BlockEdit, props),
                    select(props, 'Bottom Curve', [
                        { value: '', label: 'No Bottom Curve' },
                        { value: prefix + 'curve-1', label: 'Curve 1' },
                        { value: prefix + 'curve-2', label: 'Curve 2' },
                        { value: prefix + 'curve-3', label: 'Curve 3' },
                        { value: prefix + 'curve-4', label: 'Curve 4' },
                        { value: prefix + 'curve-5', label: 'Curve 5' },
                    ]),
                    toggle(props, prefix + 'shadow', 'Add Shadow')
                );
            };
        })
    );

})();