$(function () {
    $('#logs .view-details').click(function(event) {
        var $clickedDetails = $(this);
        var $detailsWrapper = $(this).closest('li').find('.details');
        if ($clickedDetails.hasClass('active')) {
            $detailsWrapper.slideUp().removeClass('active');
            $clickedDetails.removeClass('active').text('view');
        }else{
            $detailsWrapper.slideDown().addClass('active');
            $clickedDetails.addClass('active').text('close');
        }
    });
});

