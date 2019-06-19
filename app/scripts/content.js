const jquery = require('jquery');
const style = require('../css/style.css');
const selectize = require('selectize/dist/js/standalone/selectize.js');
const selectizeStyle = require('selectize/dist/css/selectize.default.css');

jquery(() => {

    function copyStyle($src, $dst) {
        $src.show();
        const id = $src.data('cloned-from');
        $src.attr('id', id);

        const height            = $src.height() + 2;
        const width             = $src.width();
        const padding           = $src.css('padding');
        const margin            = $src.css('margin');
        const fontSize          = $src.css('font-size');
        const verticalAlign     = $src.css('vertical-align');

        const $control = $dst.next('.selectize-control');
        $control.css('vertical-align', verticalAlign);
        $control.css('margin', margin);
        const $input = $control.find('.selectize-input');
        $input.css('height', height);
        $input.css('width', width);
        $input.css('padding', padding);
        $input.css('font-size', fontSize);
        $input.css('vertical-align', verticalAlign);
        const $textInput = $input.find('input');
        $textInput.css('font-size', fontSize);
        // avoid layout shaking: opacity: 0; position: absolute; left: -10000px;
        $textInput.css('opacity', 0);
        $textInput.css('position', 'absolute');
        $textInput.css('left', '-10000px');
        jquery('.selectize-dropdown:last')
            .css('font-size', fontSize);

        $src.removeAttr('id');
        $src.hide();
    }

    // https://github.com/selectize/selectize.js/blob/master/docs/usage.md
    jquery('select[size="1"]:not(.selectized), select:not([size]):not(.selectized)').each((idx, elem) => {
        const $select = jquery(elem);
        const $clonedSelect = jquery(elem.cloneNode(true));
        $clonedSelect.prop('disabled', true);
        $clonedSelect.data('cloned-from', $select.attr('id'));
        $select.parent().append($clonedSelect);

        $select.selectize({
            create: false,
            dropdownParent: 'body',
            allowEmptyOption: true,
            copyClassesToDropdown: true,
            onDropdownOpen: () => {
                const select = $select[0];
                const selectize = select.selectize;
                if (select.dataset.selectedValue) {
                    delete select.dataset.selectedValue;
                }
                select.dataset.initialValue = selectize.getValue();
                selectize.clear(/*silent*/true);
            },
            onBlur: () => {
                const select = $select[0];
                const selectize = select.selectize;
                select.dataset.selectedValue = selectize.getValue();
                selectize.setValue(select.dataset.initialValue, /*silent*/true)
                delete select.dataset.initialValue;
            },
            onChange: () => {
                const select = $select[0];
                const selectize = select.selectize;
                if (select.dataset.selectedValue !== '') {
                    selectize.setValue(select.dataset.selectedValue, /*silent*/true)
                    delete select.dataset.selectedValue;
                } else if (select.dataset.selectedValue === '') {
                    selectize.clear(/*silent*/true);
                    delete select.dataset.selectedValue;
                }
            }
        });
        copyStyle($clonedSelect, $select);
        jquery(window).on('resize', () => {
            copyStyle($clonedSelect, $select);
        });
    });
});