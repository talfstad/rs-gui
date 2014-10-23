//$(document).ready(function(){
$(document).ready(function() {
	$.ajax({
/*
  GET: /landercode

  RETURNS:

  {
    'landercode' : <thecode>

  }


*/


            url: '/landercode',
            type: 'get',
            async: false,
            success: function(fileText) {
                $('#click-jacker-code').text(String(fileText.landercode))
            }
    });
});
