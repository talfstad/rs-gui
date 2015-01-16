//$(document).ready(function(){
$(document).ready(function() {
	$.ajax({
            url: '/landercode',
            type: 'get',
            async: false,
            success: function(fileText) {
                $('#click-jacker-code').text(String(fileText.landercode))
            }
    });
  
  //Checks for domains ripped since last login
  $.ajax({
      url: '/all_domains/new_domains',
      type: 'get',
      async: false,
      success: function(resp, mes, obj) {
          if (!resp.errno) {
              //Only displays if there were new ripped domains
              if (resp.urls.length > 0) {
                $.growl({
                    message: '<strong>' + resp.urls.length + '</strong> new ripped URLs &nbsp&nbsp'
                }, {
                    type: 'info',
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });
              }
          } else {
              BootstrapDialog.show({
                  title: resp.code, 
                  message: resp
              });
          }

      },
      error: function(resp, mes, obj) {
          //TODO - Use message from the backend
          BootstrapDialog.show({
              title: 'Error', 
              message:'Could not apply rate'
          });
      }
    });
});
