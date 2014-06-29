$(function() {

  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  $('.draggable').draggable({
        scroll: false,
        revert: "invalid",
        snap: ".search-results",
        stack: ".col-md-3",
        zIndex: 9999,
        appendTo: '.drop-zone',
        helper: 'clone'
    });

  $('.drop-zone').droppable({
    accept: '.draggable',
    drop: function (event, ui) {
      var helperHtml = $(ui.helper).parent().html();
      var helperList = '<li><div class="search-result">' + $(ui.helper).html() + '</div></li>';
       $('.canvas-view').append(helperHtml);
       $('.convas-view .search-result').removeClass('ui-draggable-dragging');
       $('.list-view .list-view-list').append(helperList);
       $('.list-view .list-view-list .search-result').attr('style', '');
       $(ui.draggable).removeClass('draggable ui-draggable');
    }
  });

  $(document).on('change', '.sub-row .view-buttons input', function(event) {
    event.preventDefault();
    var checkedRadio = $('input:checked').attr('id');
    if (checkedRadio == 'list-radio') {
      $('.list-view').fadeIn(function() {
        $('.canvas-view').addClass('overlay');
      });
    }else{
      $('.list-view').fadeOut(function() {
        $('.canvas-view').removeClass('overlay');
      });
    }
  });

  $(document).on('click', '.main-content-outlet .search-result', function(event) {
    event.preventDefault();
    var $clickObject = $(this);
    var clickTitle = $clickObject.find('.object-title').text();
    var clickJcode = $clickObject.find('span.jCode').text();
    //loop through each search result and remove active class
    $('.main-content-outlet .search-result').each(function(index, el) {
      var $thisResult = $(this);
      if ($thisResult.hasClass('active')) {
        $thisResult.removeClass('active');
      };
    });
    $('.icon-edit a').click();
    $clickObject.addClass('active');
    $('#edit #edit-domain').val(clickTitle);
    $('#edit #edit-jcode').val(clickJcode);
  });

});
