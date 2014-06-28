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
});
