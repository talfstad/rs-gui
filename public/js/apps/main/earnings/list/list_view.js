define(["app",
        "tpl!apps/main/earnings/list/templates/earnings.tpl",
        "tpl!apps/main/earnings/list/templates/earnings-list.tpl",
        "tpl!apps/main/earnings/list/templates/no-earnings.tpl",
        "tpl!apps/main/earnings/list/templates/earnings-item.tpl",
        "tpl!apps/main/earnings/list/templates/earnings-graph.tpl",
        "tpl!apps/main/earnings/list/templates/overview_box_item.tpl",
        "moment",
        "bootstrap-dialog", 'daterangepicker',
        "morris", "bootstrap-notify", "comma-sort",
        "datatablesbootstrap"],

function(RipManager, earningsTpl, earningsListTpl, noEarningsTpl, earningsItemTpl, earningsGraphTpl, overviewBoxItem, moment, BootstrapDialog){
  RipManager.module("EarningsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.EarningsListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: earningsTpl,
      nDays: 0,
      
      initialize: function(options){
        this.nDays = options.nDays.n;
      },
     
      regions: {
        overviewStat1Region: "#earnings-stat-1",
        overviewStat2Region: "#earnings-stat-2",
        overviewStat3Region: "#earnings-stat-3",
        overviewStat4Region: "#earnings-stat-4",
        earningsGraphRegion: "#earnings-graph",
        earningsTableRegion: "#earnings-table-container"
      },

      onDomRefresh: function(){
        $('#earnings-daterange span').html(moment().subtract(this.nDays, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
 
        $('#earnings-daterange').daterangepicker({
            format: 'MM/DD/YYYY',
            startDate: moment().subtract(this.nDays, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2015',
            dateLimit: { days: 30 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
               'Today': [moment(), moment()],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'This Month': [moment().subtract(30, 'days'), moment()]
            },
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        }, function(start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#earnings-daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            var nDays = (end-start)/(1000*60*60*24);
            //where we reset collection with different n
            RipManager.trigger("earnings:update", nDays);
        });
      }
    });

    View.OverviewDailyStatItem = Marionette.ItemView.extend({
      template: overviewBoxItem,

      initialize: function (attrs) {
        this.options = attrs;
      },
      
      serializeData: function(){
        return this.options;
      }

    });


    View.EarningsGraph = Marionette.ItemView.extend({
      template: earningsGraphTpl,
      numbersWithCommas: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },

      onDomRefresh: function() {
        var me = this;
        var data = this.options.earningsGraph;

        //access the model to get the data
        var earningsGraph = new Morris.Area({
          element: 'earnings-chart',
          resize: true,
          data: data,
          hoverCallback: function(index, options, default_content, row) {
              var date = moment(row.day).format('LL');

              var html = "<div class='morris-hover-row-label'>"+ date +"</div><div class='morris-hover-point' style='color: #00a65a'>" +
                          "Payout: $" +
                          me.numbersWithCommas(row.payout) +
                          "</div>" +

                          "<div class='morris-hover-point' style='color: #0073b7'>" +
                          
                          "Conversions: " +
                          me.numbersWithCommas(row.conversions) +
                          "</div>";
                         

              return(html);
            },
          xkey: 'day',
          ykeys: ['conversions', 'payout'],
          labels: ['Conversions', 'Payout'],
          lineColors: ['#0073b7', '#00a65a'], //'#3c8dbc', 
          fillOpacity: 0.1,
          hideHover: 'auto',
        });
      },

      serializeData: function(){
        return {
          earningsGraph: this.options.earningsGraph
        }
      }
    });


    View.EarningsView = Marionette.ItemView.extend({
      template: earningsItemTpl,
      tagName: "tr",

      templateHelpers: function(){
        return {
          numbersWithCommas: function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
          mult: function(x, y) {
            return x*y;
          }
        };
      }    
    });

    //basically useless view for the composite view
    var noEarningsView = Marionette.ItemView.extend({
      template: noEarningsTpl,
      tagName: "tr",
      className: "alert",
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.EarningsListView = Marionette.CompositeView.extend({
      id: "earnings-table",
      tagName: "table",
      className: "display dataTable",
      template: earningsListTpl,
      emptyView: noEarningsView,
      childView: View.EarningsView,
      childViewContainer: "tbody",

      initialize: function(){
        this.listenTo(this.collection, "reset", function(){
          this.attachHtml = function(collectionView, childView, index){
            collectionView.$el.append(childView.el);
          }
        });
      },

      onRenderCollection: function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.prepend(childView.el);
        }
      },

      onDomRefresh: function() {
        $("#earnings-table").dataTable({
          "deferRender": true,
          "aoColumnDefs": [
            {
              fnRender: function ( obj ) {
                var date = new Date(obj.aData[0]);
                return moment(date).format('LL');
              },
              "aTargets": [0]
            },
            
            { "sType": "numeric-comma", "aTargets": [2,3,4,5]},
            
            {
              fnRender: function(obj){
                return "$" + obj.aData[obj.iDataColumn];
              },
              "aTargets": [5]
            }

          ]
        });

        $("#earnings-table").addClass("table table-bordered table-hover");
        $("#earnings-table").dataTable().fnSort([[0, 'desc']])
      }
    });
  });

  return RipManager.EarningsApp.List.View;
});
