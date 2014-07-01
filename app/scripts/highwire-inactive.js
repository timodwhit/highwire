$(function () {
  //delete progress bar
  $(function() {
    var progressTimer,
      progressbar = $( "#delete-progressbar" ),
      progressLabel = $( ".delete-progress-label" ),
      dialogButtons = [{
        text: "Cancel Deletion",
        click: closeDownload
      }],
      dialog = $( "#delete-server-dialog" ).dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: false,
        buttons: dialogButtons,
        open: function() {
          progressTimer = setTimeout( progress, 2000 );
        }
      }),
      downloadButton = $( ".delete-inactive" )
        .on( "click", function() {
            var title = $(this).closest('li').find('.task-title').text();
            alert("Are you sure you want to delete "+title);
            dialog.dialog( "open" );
            $(this).addClass('active');
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
        $('.btn.active').closest('li').fadeOut();
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
      $('.btn.active').removeClass('active');
      progressbar.progressbar( "value", false );
      progressLabel
        .text( "Starting delete..." );
      downloadButton.focus();
    }
  });
});

