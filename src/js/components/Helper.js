class Helper {
    testFunction = () => {
        this.$component.find('input[name=header_class]').change(function () {
            const $checkbox = $(this);
            const dataClass = $checkbox.data('class');
            const header = $('header');
            $checkbox.is(':checked') ? header.addClass(dataClass) : header.removeClass(dataClass);
        });
    };
}

export default Helper;