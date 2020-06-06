import Helper from 'Helper';

class Settings {
    constructor(selector) {
        Helper.testFunction();
        this.selector = selector;
        this.$component = $(selector);
        this.$buttonOpenClose = this.$component.find('button');

        this.events();
        this.customEvents();
    }

    events = () => {
        this.$buttonOpenClose.click(() => {
            this.$component.toggleClass('_open');
        });
    };

    customEvents = () => {
        this.$component.find('input[name=header_class]').change(function () {
            const $checkbox = $(this);
            const dataClass = $checkbox.data('class');
            const header = $('header');
            $checkbox.is(':checked') ? header.addClass(dataClass) : header.removeClass(dataClass);
        });
    };
}

document.addEventListener('DOMContentLoaded', function(){
    new Settings('.js-settings');
});