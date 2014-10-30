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
    $('#myDomains').dataTable( {
        "sDom": "<'row'<'span8'l><'span8'f>r>t<'row'<'span8'i><'span8'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    } );

    //Adds paginator class to paginator
    $('#myDomains_paginate ul').addClass("pagination");

    //Binds the delete button functionality for each button on the table
    bindAllDeleteButtons();

    //Binds functions to save new links
    $('#addNewDomainSubmitButton').click(function(e) {
        //Prevents page refresh
        e.preventDefault();

        $('#addNewDomainForm').validate({
            rules: {
                url: {
                    required: true,
                    url: true
                }
            }
        });

        //If valid, submit form
        if($('#addNewDomainForm').valid()) {            
            addNewDomain();
        }
    });


    /*
     * Makes ajax call to submit the change rate form
     */
    function addNewDomain() {
        var postData = { 
            url: $('input[name="url"]').val()
        } 
        $.ajax({
            type: 'POST',
            data: postData,
            url: '',
            dataType: 'JSON',
            success: function(resp, mes, obj) {
                //TODO - Update table
                if (!resp.errno) {
                    //Notification for success
                    $.growl({
                        message: 'New Domain Added: ' + resp.url
                    }, {
                        type: 'success',
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        template:'<div data-growl="container" class="alert" role="alert">' +
                                '<button type="button" class="close" data-growl="dismiss">' +
                                    '<span aria-hidden="true">×</span>' +
                                    '<span class="sr-only">Close</span>' +
                                '</button>' +
                                '<span data-growl="icon"></span>' +
                                '<span data-growl="title"></span>' +
                                '<span data-growl="message"></span>' +
                                '<a href="#" data-growl="url"></a>' +
                            '</div>'
                    });

                    //Updates Table
                    var table = $('table[id="myDomains"]').dataTable();
                    var deleteButton = '<a id="' + resp.id +
                                       '" name="deleteDomainButton" ' +
                                       'class="linkDeleteFromAll btn btn-danger btn-sm delete-column">X</a>';
                    table.fnAddDataAndDisplay([resp.url, deleteButton]);

                    //Rebinds all delete buttons
                    bindAllDeleteButtons();                    
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
                    message:'Could not add new domain.'
                });
            }            
        });
    }

    /*
     * Binds delete button functionality for all buttons (used on page load)
     */
    function bindAllDeleteButtons() {
        $('.linkDeleteFromAll').click(function(e) {
            var id = this.id;
            var row = $('a[id=' + id + ']').closest('tr');
            var domainVal = row.children('td')[0].textContent;
            var table = $('table[id="myDomains"]').DataTable();

            // Pop up a confirmation dialog
            BootstrapDialog.confirm('Are you sure you want to delete the domain <strong>' + domainVal + '</strong>?', function(result) {
                if(result) {
                    var postData = { 
                        id: e.target.id
                    } 


                    $.ajax({
                        type: 'GET',
                        url: '/my_domains/delete/?id=' + id,
                        success: function(resp, mes, obj) {
                            //Removes from UI
                            if (!resp.errno) {
                                //Removes row from table
                                table.row(row).remove().draw();

                                //Puts up removal notification
                                $.growl({
                                    message: 'Successfully deleted domain'
                                }, {
                                    type: 'success',
                                    animate: {
                                        enter: 'animated fadeInDown',
                                        exit: 'animated fadeOutUp'
                                    },
                                    template:'<div data-growl="container" class="alert" role="alert">' +
                                            '<button type="button" class="close" data-growl="dismiss">' +
                                                '<span aria-hidden="true">×</span>' +
                                                '<span class="sr-only">Close</span>' +
                                            '</button>' +
                                            '<span data-growl="icon"></span>' +
                                            '<span data-growl="title"></span>' +
                                            '<span data-growl="message"></span>' +
                                            '<a href="#" data-growl="url"></a>' +
                                        '</div>'
                                });
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
                                message:'Could not delete domain.'
                            });
                        }            
                    });
                }
            });
        });
    }

});
