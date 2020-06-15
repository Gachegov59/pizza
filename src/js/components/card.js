$(function () {
    let $card = $('.card');
    let $choiceItem = $('.card__choice-item');

    $($card).each( function () {
        $(this).find($choiceItem).on('click', function () {
            $(this).toggleClass('_active');
            $(this).closest($card).toggleClass('_show-btn');
        });
    });
});