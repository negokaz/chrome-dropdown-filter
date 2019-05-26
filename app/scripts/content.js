const jquery = require('jquery');
const style = require('../css/style.css');
const selectize = require('selectize/dist/js/standalone/selectize.js');
const selectizeStyle = require('selectize/dist/css/selectize.default.css');

jquery(() => {
    // https://github.com/selectize/selectize.js/blob/master/docs/usage.md
    jquery('select[size="1"]:not(.selectized), select:not([size]):not(.selectized)').each((idx, elem) => {
        const $select = jquery(elem);
        const height            = $select.height();
        const width             = $select.width();
        const padding           = $select.css('padding');
        const margin            = $select.css('margin');
        const fontSize          = $select.css('font-size');
        const verticalAlign     = $select.css('vertical-align');
        $select.selectize({
            create: false,
            dropdownParent: 'body',
            onDropdownOpen: () => {
                $select[0].selectize.clear();
            },
        });
        const $control = $select.next('.selectize-control');
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
        jquery('.selectize-dropdown:last')
            .css('font-size', fontSize);
    });
});