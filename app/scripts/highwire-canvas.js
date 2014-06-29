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
       $('.droppable-list .list-view-list').append(helperList);
       $('.droppable-list .list-view-list .search-result').attr('style', '');
       $(ui.draggable).hide();
    }
  });

  //canvas/list-view toggle
  $(document).on('change', '.view-buttons input', function(event) {
    event.preventDefault();
    var checkedRadio = $('input:checked').attr('id');
    if (checkedRadio == 'list-radio') {
      $('.droppable-list').fadeIn(function() {
        $('.drop-zone').addClass('overlay');
      });
    }else{
      $('.droppable-list').fadeOut(function() {
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
    enviroName = tabId.replace('-tab',''),
    canvasName = enviroName + '-canvas',
    canvasId = '#' + canvasName,
    listName = enviroName + '-list-view',
    listId = '#' + listName;
    $('.enviroment-menu li a').each(function(index, el) {
      var $thisA = $(this);
      if ($thisA.hasClass('active')) {
        $thisA.removeClass('active');
      };
    });
    $('.main-content-outlet .canvas-view').each(function(index, el) {
      var $thisCanvas = $(this);
      if ($thisCanvas.hasClass('drop-zone')) {
        $thisCanvas.fadeOut().droppable('destroy').removeClass('drop-zone');
      };
    });
    $('.main-content-outlet .list-view').each(function(index, el) {
      var $thislist = $(this);
      if ($thislist.hasClass('droppable-list')) {
        $thislist.fadeOut().removeClass('droppable-list');
      };
    });
    if ($('#list-radio').closest('.btn').hasClass('active')) {
      $(listId).show();
    };
    $(listId).addClass('droppable-list');
    $(canvasId).fadeIn().addClass('drop-zone').droppable({
      accept: '.draggable',
      drop: function (event, ui) {
        var helperHtml = $(ui.helper).parent().html();
        var helperList = '<li><div class="search-result">' + $(ui.helper).html() + '</div></li>';
         $('.drop-zone').append(helperHtml);
         $('.drop-zone .search-result').removeClass('ui-draggable-dragging');
         $('.droppable-list .list-view-list').append(helperList);
         $('.droppable-list .list-view-list .search-result').attr('style', '');
         $(ui.draggable).hide();
      }
    });
    $('.draggable').show();
    $clickedTab.addClass('active');
    $('.main-content-outlet .drop-zone .search-result .object-title').each(function(index, el) {
      var $thisCanvasObject = $(this),
      $thisCanvasObjectRole = $thisCanvasObject.attr('role');
      $('.search-results .search-result .object-title').each(function(index, el) {
        var $thisResultObject = $(this);
        var thisResultRole = $(this).attr('role');
        if (thisResultRole == $thisCanvasObjectRole) {
          $thisResultObject.closest('.draggable').hide();
        };
      });
    });
  });

});
