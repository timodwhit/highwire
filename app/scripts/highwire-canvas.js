//outerHTML function
$.fn.outerHTML = function(){

    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (
      function(el){
          var div = document.createElement('div');
          div.appendChild(el.cloneNode(true));
          var contents = div.innerHTML;
          div = null;
          return contents;
    })(this[0]));

}

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
      var helperHtml = $(ui.helper).outerHTML();
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
    var titleDataRole = $clickObject.find('.object-title').attr('data-role');
    //loop through each search result and remove active class
    $('.main-content-outlet .search-result').each(function(index, el) {
      var $thisResult = $(this);
      if ($thisResult.hasClass('active')) {
        $thisResult.removeClass('active');
      };
    });
    $('.icon-edit a').click();
    $clickObject.addClass('active');
    $(".main-content-outlet .droppable-list .search-result .object-title")
      .each(function(index, el) {
      var $thisTitleItem = $(this);
      var thisTitleRole = $thisTitleItem.attr('data-role');
      if (thisTitleRole == titleDataRole) {
        $thisTitleItem.closest('.search-result').addClass('active');
      };
    });
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
    $('#sync input').each(function(index, el) {
      var $thisInput = $(this);
      var thisId = $(this).attr('id');
      if (thisId == enviroName) {
        $thisInput.attr("disabled", "disabled");
      } else {
        $thisInput.removeAttr('disabled');
      }
    });
    $('.main-content-outlet .canvas-view').each(function(index, el) {
      var $thisCanvas = $(this);
      if ($thisCanvas.hasClass('drop-zone')) {
        $thisCanvas.hide().droppable('destroy').removeClass('drop-zone');
      };
    });
    $('.main-content-outlet .list-view').each(function(index, el) {
      var $thislist = $(this);
      if ($thislist.hasClass('droppable-list')) {
        $thislist.hide().removeClass('droppable-list');
      };
    });
    if ($('#list-radio').closest('.btn').hasClass('active')) {
      $(listId).show();
    };
    $(listId).addClass('droppable-list');
    $(canvasId).show().addClass('drop-zone').droppable({
      accept: '.draggable',
      drop: function (event, ui) {
        var helperHtml = $(ui.helper).outerHTML();
        var helperList = '<li><div class="search-result">' + $(ui.helper).outerHTML() + '</div></li>';
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
      $thisCanvasObjectRole = $thisCanvasObject.attr('data-role');
      $('.search-results .search-result .object-title').each(function(index, el) {
        var $thisResultObject = $(this);
        var thisResultRole = $(this).attr('data-role');
        if (thisResultRole == $thisCanvasObjectRole) {
          $thisResultObject.closest('.draggable').hide();
        };
      });
    });
  });

  //clone progress bar
  $( "input.clone-btn" ).click(function(event) {
      /* Act on the event */
      if ($('.main-content-outlet .drop-zone .search-result.active').length){
      $(function() {
      var progressbar = $( "#clone-progressbar" ),
        progressLabel = $( "#clone-progressbar .progress-label" );
      progressbar.fadeIn();
      progressbar.progressbar({
        value: false,
        change: function() {
          progressLabel.text( progressbar.progressbar( "value" ) + "%" );
        },
        complete: function() {
          progressbar.fadeOut();
        }
      });

      function progress() {
        var val = progressbar.progressbar( "value" ) || 0;

        progressbar.progressbar( "value", val + 2 );

        if ( val < 99 ) {
          setTimeout( progress, 80 );
        }
      }

      setTimeout( progress, 2000 );
    });
  } else {
    alert('Please select an object from the canvas.');
  }
  });

  //delete progress bar
  $(function() {
    var progressTimer,
      progressbar = $( "#delete-progressbar" ),
      progressLabel = $( ".delete-progress-label" ),
      dialogButtons = [{
        text: "Cancel Deletion",
        click: closeDownload
      }],
      dialog = $( "#delete-dialog" ).dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: false,
        buttons: dialogButtons,
        open: function() {
          progressTimer = setTimeout( progress, 2000 );
        }
      }),
      downloadButton = $( ".delete-btn" )
        .on( "click", function() {
          if ($('.main-content-outlet .drop-zone .search-result.active').length){
            alert("Are you sure you want to delete this object?");
            dialog.dialog( "open" );
          } else {
            alert('Please select an object from the canvas.');
          }
        });

    progressbar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( "Current Progress: " + progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text( "Complete!" );
        dialog.dialog( "option", "buttons", [{
          text: "Close",
          click: closeDownload
        }]);
        $(".ui-dialog button").last().focus();
        $(".main-content-outlet .drop-zone .search-result").each(function(index, el) {
          var $thisSearchResult = $(this);
          if ($thisSearchResult.hasClass('active')) {
            var thisRole = $thisSearchResult.find('.object-title').attr('data-role');
            $(".main-content-outlet .droppable-list .search-result .object-title")
              .each(function(index, el) {
              var $thisTitleItem = $(this);
              var thisTitleRole = $thisTitleItem.attr('data-role');
              if (thisTitleRole == thisRole) {
                $thisTitleItem.closest('.search-result').fadeOut().remove();
              };
            });
            $("#index .search-result .object-title").each(function(index, el) {
              var $thisTitleItem = $(this);
              var thisTitleRole = $thisTitleItem.attr('data-role');
              if (thisTitleRole == thisRole) {
                $thisTitleItem.closest('.search-result').fadeIn();
              };
            });
            $thisSearchResult.fadeOut().remove();
          };
        });
      }
    });

    function progress() {
      var val = progressbar.progressbar( "value" ) || 0;

      progressbar.progressbar( "value", val + Math.floor( Math.random() * 3 ) );

      if ( val <= 99 ) {
        progressTimer = setTimeout( progress, 50 );
      }
    }

    function closeDownload() {
      clearTimeout( progressTimer );
      dialog
        .dialog( "option", "buttons", dialogButtons )
        .dialog( "close" );
      progressbar.progressbar( "value", false );
      progressLabel
        .text( "Starting delete..." );
      downloadButton.focus();
    }
  });

  //sync events
  // $('#sync input').click(function(event) {
  //   /* Act on the event */
  //   event.preventDefault();
  //   var $thisBtn = $(this);
  //   var thisBtnId = $thisBtn.attr('id');
  //   var tabId = '#'+thisBtnId +'-sync';
  //   $('.tab-content .tab-pane.active').removeClass('active');
  //   $(tabId).addClass('active');
  // });

});
