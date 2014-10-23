//$(document).ready(function(){

/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
    "sSortAsc": "header headerSortDown",
    "sSortDesc": "header headerSortUp",
    "sSortable": "header"
} );

/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
}

/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
                }
            };

            $(nPaging).addClass('pagination').append(
                '<ul>'+
                    '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                    '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                '</ul>'
            );
            var els = $('a', nPaging);
            $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
            $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                // Remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // Add the new list items and their event handlers
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                        .insertBefore( $('li:last', an[i])[0] )
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                            fnDraw( oSettings );
                        } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
} );

/* Table initialisation */
$(document).ready(function() {
    $('#rippedDomains').dataTable( {
        "sDom": "<'row'<'span8'l><'span8'f>r>t<'row'<'span8'i><'span8'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        },
        "order": [[1, "asc"]]
    } );

    //Adds paginator class to paginator
    $('#rippedDomains_paginate ul').addClass("pagination");
} );

/* ********************************************************************************** */

$(document).ready(function() {
    // Delete domain link click
    $('#urlList table tbody').on('click', 'td a.linkDeleteFromAll', deleteAllDomain);
});

// Delete domain
function deleteAllDomain(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this domain?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        var postData = { 
            id: $(this).attr('id')
        } 

        $.ajax({
            type: 'POST',
            data: postData,
            url: '/all_domains/delete',
            dataType: 'JSON',
            statusCode: {
                200: function() {
                    location.reload(true)
                    //populateTable();
                }
            }
        });
        
    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

    return false;

};

// Fill table with data
/*
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/all_domains/list', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.json, function(){
            tableContent += '<tr id="' + this.id + '">';
            tableContent += '<td class="url">' + this.url + '</td>';
            if (this.registered == 1) {
                tableContent += '<td class="registered">Registered</td>';
            }
            else {
                tableContent += '<td class="unregistered">Unregistered</td>';
            }
            tableContent += '<td class="count">' + this.count + '</td>';
            tableContent += '<td><a class="linkDeleteFromAll" href="" id="' + this.id + '">Delete</a></td>';
            tableContent += '<td><a href="/links?domain=' + this.url + '"" class="linkEditLinks">Go to links page</a></td>';
            tableContent += '<td>';
            tableContent += '  <form action="/all_domains/edit_rate" method="post">';
            tableContent += '    <input type="text" name="rate" value="' + this.rate +'">';
            tableContent += '    <input type="hidden" name="url" value="' + this.url + '">';
            tableContent += '  </form>';
            tableContent += '</td>'
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#urlList table tbody').html(tableContent);
    });
};
*/
