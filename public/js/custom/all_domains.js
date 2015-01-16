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

            //Rebinds buttons
            bindDeleteDomainButtons();
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

    // Delete domain link click
    bindDeleteDomainButtons();

    checkForNewRows();

    
} );

/* ********************************************************************************** */

// Checks for new rows for highlighting
function checkForNewRows() {
    //Checks for domains ripped since last login
    $.ajax({
        url: '/all_domains/new_domains',
        type: 'get',
        async: false,
        success: function(resp, mes, obj) {
            if (!resp.errno) {
                //Only displays if there were new ripped domains
                if (resp.urls.length > 0) {
                    //Apply highlight css
                    applyNewRowStylings(resp.urls);

                    //Notify user of highlights
                    $.growl({
                        message: 'New URLs are highlighted &nbsp&nbsp'
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
}

// Applies new row stylings
function applyNewRowStylings(urls) {
    var datatable = $('#rippedDomains').dataTable();
    $(datatable.fnSettings().aoData).each(function(){
        var cellUrlValue = $(this)[0].anCells[0].innerText;
        var cell = $(this.nTr);
        $.each(urls, function(key, obj) {
            if(obj.base_url == cellUrlValue) {
                cell.addClass('new_row');
                return false;
            }        
        });        
    });

    //Sorts creation dates
    datatable.fnSort([[2, 'asc']])
}

// Delete domain
function bindDeleteDomainButtons(e) {
    $('.deleteDomainButton').click(function(e){
        e.preventDefault();

        var row = $(e.target).closest('tr');
        var domainVal = row.children('td')[0].textContent;
        var table = $('table[id="rippedDomains"]').DataTable();

        // Pop up a confirmation dialog
        BootstrapDialog.confirm('Are you sure you want to delete the domain <strong>' + domainVal + '</strong>?', function(result) {
            if(result) {
                var postData = { 
                    id: e.target.id
                } 
                
                $.ajax({
                    type: 'POST',
                    data: postData,
                    url: '/all_domains/delete',
                    dataType: 'JSON',
                    statusCode: {
                        200: function() {
                            //Removes row from table
                            table.row(row).remove().draw();

                            //Puts up notification
                            $.growl({
                                message: 'Successfully deleted domain &nbsp&nbsp'
                            }, {
                                type: 'success',
                                animate: {
                                    enter: 'animated fadeInDown',
                                    exit: 'animated fadeOutUp'
                                }
                            });
                        }
                        
                    }
                });
            }
        }, this);
    });
};