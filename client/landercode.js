$(document).ready(function () {    
    /* Request format
     * {
     *   domain: xxx.com
     *   hrefs: {
     *       www.site1.com: "",
     *       www.site2.com: ""
     *     }
     * }
     *
     * Response format
     *  {
     *   rate: "0.4",
     *   bc: "0.3",
     *   hrefs: {
     *       www.site1.com: { 
     *                       buildcave: "buildcave.com",
     *                       otherSite: "otherSite.com"
     *                       }
     *       www.site2.com: { 
     *                       buildcave: "buildcave2.com",
     *                       otherSite: "otherSite2.com"
     *                       }
     *     }
     * }
     *
     */
    
    var hrefs = {},
        request = {};
    
    //Retrieves all Anchor tags
    $('a').each(function(key, val) {
        var href = $(this).attr('href');
        
        //Checks if href is defined before adding
        if (href) {
            //Adds item to the href list
            hrefs[href] = "";
            
            //Binds the hover functionality
            $(this).hover(function() {
                $(this).attr('href', href);
            });
        }
    });
    
    //Builds request object
    request.domain = location.host;
    request.hrefs = hrefs;
    request.user = 'testy@email.com';
    
    //Make request
    var url =  "http://ec2-54-187-151-91.us-west-2.compute.amazonaws.com:3005/all_domains/new?url=" + document.URL;    
    $.ajax({
      type: "POST",
      url: url,
      data: request,
      dataType: "json",
      success: function(response) {
                    //Response rates
                    var bcRate = response.bc_rate,
                        otherRate = response.rate,
						useBcLink = false,
						useOtherLink = false,
						decision = Math.random();
                    
					//Algorithm to decide which link to replace with
					if (bcRate < otherRate) {
					     if (decision > 0 && decision < bcRate) {
							useBcLink = true;
						 } else if (decision > bcRate && (decision < bcRate + otherRate)) {
							useOther = true;
						 }
					} else {
						if (decision > 0 && decision < otherRate) {
							useOther = true;
						 } else if (decision > otherRate && (decision < otherRate + bcRate)) {
							useBcLink = true;
						 }
					}
					
                    //Loops through all anchor tags again and makes necessary replacements
                    $('a').each(function(key, val) {
                        var thisHref = $(this).attr('href');
                        
						//Will only replace links if one is true
                        if (useBcLink) {
                            //BuildCave is used
                            $("this").attr("href", response.hrefs[thisHref].bc_link);
                        } else if (useOtherLink) {
                            //Other is used
                            $("this").attr("href", response.hrefs[thisHref].other_link);
                        }
                    });
                 }
    });
});
