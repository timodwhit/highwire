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

  //search event
  $('.ember-text-field').keyup(function(event) {
    event.preventDefault();
    var searchVal = $('.search-form .select-search .ember-text-field').val();
    if (searchVal.length) {
      $('#index .search-results .search-result ').each(function(index, el) {
        var $thisResult = $(this);
        $thisResult.fadeOut();
        var thisResultTitle = $thisResult.find('.object-title').text();
        if (thisResultTitle.toLowerCase().indexOf(searchVal) >= 0) {
          $thisResult.fadeIn();
        }
      });
    } else {
      $('#index .search-results .search-result ').each(function(index, el) {
        var $thisResult = $(this);
        $thisResult.fadeIn();
      });
    }
  });
  $('.search-form input[value="search"]').click(function(event) {
    $('.ember-text-field').keyup();
  });
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
    var vNumber = $clickObject.find('.v-number').text();
    var technology = $clickObject.find('.technology').text().toLowerCase();

    $('.main-content-outlet .search-result.active').each(function(index, el) {
      $(this).removeClass('active');
    });
    $('.sidebar-nav .nav-tabs .object-action').fadeIn();
    $('.icon-pencil').closest('a').tab('show');
    $(".main-content-outlet .droppable-list .search-result .object-title")
      .each(function(index, el) {
      var $thisTitleItem = $(this);
      var thisTitleRole = $thisTitleItem.attr('data-role');
      if (thisTitleRole == titleDataRole) {
        $thisTitleItem.closest('.search-result').addClass('active');
      };
    });
    $(".main-content-outlet .drop-zone .search-result .object-title")
      .each(function(index, el) {
      var $thisTitleItem = $(this);
      var thisTitleRole = $thisTitleItem.attr('data-role');
      if (thisTitleRole == titleDataRole) {
        $thisTitleItem.closest('.search-result').addClass('active');
      };
    });
    $('#edit #edit-domain').val(clickTitle);
    $('#edit #edit-version').val(vNumber);
    $('#edit #edit-tech').val(technology);
    $('#edit #edit-jcode').val(clickJcode);
  });

  //canvas edit submit
  $(document).on('click', '#edit .button', function(event) {
    event.preventDefault();
    var $clickedBtn = $(this),
    titleVal = $('#edit #edit-domain').val(),
    versionVal = $('#edit #edit-version').val(),
    techVal = $('#edit #edit-tech').val(),
    jcodeVal = $('#edit #edit-jcode').val(),
    imageVal = '<img class="image '+techVal+'" src="images/logo-'+techVal+'.png">';
    $activeObj = $('.main-content-outlet .search-result.active');
    $activeObj.find('.object-title').text(titleVal);
    $activeObj.find('.technology').text(techVal);
    $activeObj.find('.v-number').text(versionVal);
    $activeObj.find('.image').replaceWith(imageVal);
  });

  //canvas new submit
  $(document).on('click', '#new .button', function(event) {
    event.preventDefault();
    var $clickedBtn = $(this),
    titleVal = $('#new #new-domain').val(),
    versionVal = $('#new #new-version').val(),
    techVal = $('#new #new-tech').val(),
    jcodeVal = $('#new #new-jcode').val(),
    newHtmlVal = '<div class="search-result draggable ui-draggable"><div class="logo-image"><img class="image '+techVal+'" src="images/logo-'+techVal+'.png"></div><span class="object-title" data-role="'+titleVal+'">'+titleVal+'</span><span class="version"><span class="technology">'+techVal+'</span> (v.<span class="v-number">'+versionVal+'</span>)</span><span class="icon icon-move"></span><span class="jCode" style="display: none;">'+jcodeVal+'</span></div>';
    $activeObj = $('.main-content-outlet .search-result.active');
    $('.main-content-outlet .drop-zone, .main-content-outlet .droppable-list').append(newHtmlVal);
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
    listId = '#' + listName,
    enviromentTxt = $clickedTab.text(),
    lowercaseEnviromentTxt = enviromentTxt.toLowerCase();
    disabledOption = '#sync select option[value="'+lowercaseEnviromentTxt+'"]';
    $('#sync .sync-title').text(enviromentTxt);
    $('#sync select option').each(function(index, el) {
      $(this).removeProp('disabled');
    });
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
          progressLabel.text( 'Cloning...' );
        progressbar.fadeIn();
        progressbar.progressbar({
          value: false,
          change: function() {
            progressLabel.text( progressbar.progressbar( "value" ) + "%" );
          },
          complete: function() {
            progressbar.fadeOut();
            $(".main-content-outlet .droppable-list .search-result.active")
                .each(function(index, el) {
                var $thisListObject = $(this);
                $thisListObject.removeClass('active');
                var $thisObjectClone = $thisListObject.closest('li').clone();
                var cloneTitle = $thisObjectClone.find('.object-title').text();
                var newCloneTitle = $thisObjectClone.find('.object-title').text(cloneTitle + "-Clone");
                $(".main-content-outlet .droppable-list .list-view-list").append($thisObjectClone);
              });
            $(".main-content-outlet .drop-zone .search-result.active")
                .each(function(index, el) {
                var $thisListObject = $(this);
                $thisListObject.removeClass('active');
                var $thisObjectClone = $thisListObject.clone().removeAttr('style');
                var cloneTitle = $thisObjectClone.find('.object-title').text();
                var newCloneTitle = $thisObjectClone.find('.object-title').text(cloneTitle + "-Clone");

                $(".main-content-outlet .drop-zone").append($thisObjectClone);
            });
            $(".main-content-outlet .search-result.active").each(function(index, el) {
              $(this).removeClass('active');
            });
            $('#myTab a:first').tab('show');
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
    }else {
      alert('Please select an object from the canvas.');
    }
  });

  //backup progress bar
  $( "input.backup-btn" ).click(function(event) {
      /* Act on the event */
      if ($('.main-content-outlet .drop-zone .search-result.active').length){
        $(function() {
        var progressbar = $( "#backup-progressbar" ),
          progressLabel = $( "#backup-progressbar .progress-label" );
        progressLabel.text( 'Starting deletion...' );
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
    }else {
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
            $(".main-content-outlet .drop-zone .search-result .object-title")
              .each(function(index, el) {
              var $thisTitleItem = $(this);
              var thisTitleRole = $thisTitleItem.attr('data-role');
              if (thisTitleRole == thisRole) {
                $thisTitleItem.closest('.search-result').fadeOut().remove();
              };
            });
          };
        });
        $(".main-content-outlet .search-result.active").each(function(index, el) {
          $(this).removeClass('active');
        });
        $('#myTab a:first').tab('show');
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

  //sync event
  $(document).on('click', '#sync input[value="Sync Selected"]', function(event) {
    event.preventDefault();
    /* Act on the event */
    var $clickedSync = $(this);
    var $closestSelect = $(this).closest('#sync').find('.ember-select');
    var selectValue = $closestSelect.val();
    var lowerCaseVal = selectValue.toLowerCase();
    var cloneToList = ".main-content-outlet ."+lowerCaseVal+"-list .list-view-list";
    var cloneToCanvas = ".main-content-outlet ."+lowerCaseVal+"-canvas";
    var $progressbar = $( '#sync-progressbar' ),
        $progressLabel = $progressbar.find( ".progress-label" );
    $progressbar.fadeIn();
    $progressbar.progressbar({
      value: false,
      change: function() {
        $progressLabel.text( $progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        $progressbar.fadeOut();
        $(".main-content-outlet .droppable-list .search-result.active")
          .each(function(index, el) {
            var $thisListObject = $(this);
            $thisListObject.removeClass('active');
            var $thisObjectClone = $thisListObject.closest('li').clone();
            $(cloneToList).append($thisObjectClone);
          });
        $(".main-content-outlet .drop-zone .search-result.active")
          .each(function(index, el) {
            var $thisSelectedObject = $(this);
            $thisSelectedObject.removeClass('active');
            var $thisSelectedClone = $thisSelectedObject.clone();
            $(cloneToCanvas).append($thisSelectedClone);
          });
          $(".main-content-outlet .search-result.active").each(function(index, el) {
              $(this).removeClass('active');
            });
          $('#myTab a:first').tab('show');
        }
      });

    function progress() {
      var val = $progressbar.progressbar( "value" ) || 0;
      $progressbar.progressbar( "value", val + Math.floor( Math.random() * 3 ) );
      if ( val <= 99 ) {
        progressTimer = setTimeout( progress, 50 );
      }
    }
    setTimeout( progress, 2000 );
  });

  $('#queue .progress-1').progressbar({
      value: 77
    });

  $('#queue .progress-2').progressbar({
      value: 37
    });

});
