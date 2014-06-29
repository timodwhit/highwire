$(function() {

  //side tabs
  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  //draggable def
  $('.draggable').draggable({
        scroll: false,
        revert: "invalid",
        snap: ".search-results",
        stack: ".col-md-3",
        zIndex: 9999,
        appendTo: '.drop-zone',
        helper: 'clone'
    });

  //droppable region
  $('.drop-zone').droppable({
    accept: '.draggable',
    drop: function (event, ui) {
      var helperHtml = $(ui.helper).parent().html();
      var helperList = '<li><div class="search-result">' + $(ui.helper).html() + '</div></li>';
       $('.drop-zone').append(helperHtml);
       $('.drop-zone .search-result').removeClass('ui-draggable-dragging');
       $('.list-view .list-view-list').append(helperList);
       $('.list-view .list-view-list .search-result').attr('style', '');
       $(ui.draggable).removeClass('draggable ui-draggable');
    }
  });

  //canvas/list-view toggle
  $(document).on('change', '.view-buttons input', function(event) {
    event.preventDefault();
    var checkedRadio = $('input:checked').attr('id');
    if (checkedRadio == 'list-radio') {
      $('.list-view').fadeIn(function() {
        $('.drop-zone').addClass('overlay');
      });
    }else{
      $('.list-view').fadeOut(function() {
        $('.drop-zone').removeClass('overlay');
      });
    }
  });

  //canvas edit
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

  //enviroment tabs
  $(document).on('click', '.enviroment-tabs a', function(event) {
    event.preventDefault();
    var $clickedTab = $(this),
    tabId = $clickedTab.attr('id'),
    canvasName = tabId.replace('-tab','-canvas'),
    canvasId = '#' + canvasName;
    $('.main-content-outlet .canvas-view').each(function(index, el) {
      var $thisCanvas = $(this);
      if ($thisCanvas.hasClass('drop-zone')) {
        $thisCanvas.fadeOut().droppable('destroy').removeClass('drop-zone');
      };
    });
    $(canvasId).fadeIn().addClass('drop-zone').droppable({
      accept: '.draggable',
      drop: function (event, ui) {
        var helperHtml = $(ui.helper).parent().html();
        var helperList = '<li><div class="search-result">' + $(ui.helper).html() + '</div></li>';
         $('.drop-zone').append(helperHtml);
         $('.drop-zone .search-result').removeClass('ui-draggable-dragging');
         $('.list-view .list-view-list').append(helperList);
         $('.list-view .list-view-list .search-result').attr('style', '');
         $(ui.draggable).removeClass('draggable ui-draggable');
      }
    });
  });

});
