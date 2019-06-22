const jquery = require('jquery');
const style = require('../css/style.css');
const selectize = require('selectize/dist/js/standalone/selectize.js');
const selectizeStyle = require('selectize/dist/css/selectize.default.css');

jquery(() => {

    function copyStyle($src, $dst) {
        // 親が display:none の場合はサイズが取得できないため、一時的に表示してサイズを取得
        $src.parents().each((idx, elem) => {
            if (elem.style.display === 'none') {
                elem.dataset.__force_display = true;
                elem.style.display = '';
            }
        });
        $src.show();
        const id = $src.data('cloned-from');
        $src.attr('id', id);

        const height            = $src.height();
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
        $src.parents().each((idx, elem) => {
            if (elem.dataset.__force_display) {
                elem.style.display = 'none';
                delete elem.dataset.__force_display;
            }
        });
    }

    function applyDropdownFilter() {
        jquery('select[size="1"]:not(.applied-dropdown-filter), select:not([size]):not(.applied-dropdown-filter)').each((index, dropdown) => {
            const $dropdown = jquery(dropdown);
            $dropdown.addClass('applied-dropdown-filter');
            $dropdown.focusin(event => {
                const size = $dropdown.attr('size');
                if (size && size > 1) {
                    return;
                }
                event.preventDefault();

                const $clonedDropdown = jquery(dropdown.cloneNode(true));
                $clonedDropdown.hide();
                $dropdown.after($clonedDropdown);

                $dropdown.selectize({
                    create: false,
                    dropdownParent: 'body',
                    allowEmptyOption: true,
                    onDropdownOpen: () => {
                        if (dropdown.dataset.selectedValue) {
                            delete dropdown.dataset.selectedValue;
                        }
                        dropdown.dataset.initialValue = $dropdown.val();
                        // console.log(dropdown.dataset);
                        dropdown.selectize.clear(/*silent*/true);
                    },
                    onBlur: () => {
                        setTimeout(() => {
                            const value = $dropdown.val();
                            dropdown.selectize.destroy();
                            $dropdown.val(value);
                            $clonedDropdown.remove();

                            if (dropdown.dataset.selectedValue) {
                                $dropdown.val(dropdown.dataset.selectedValue);
                                const changeEvent = document.createEvent("HTMLEvents");
                                changeEvent.initEvent("change", false, true);
                                dropdown.dispatchEvent(changeEvent);
                            } else {
                                $dropdown.val(dropdown.dataset.initialValue);
                            }
                        }, 0);
                    },
                    onChange: () => {
                        dropdown.dataset.selectedValue = $dropdown.val();
                    }
                });
                copyStyle($clonedDropdown, $dropdown);
                dropdown.selectize.focus();
            });
        });
    } 

    const observer = new MutationObserver(applyDropdownFilter);
    observer.observe(document.body, { childList: true, subtree: true });
    applyDropdownFilter();
});