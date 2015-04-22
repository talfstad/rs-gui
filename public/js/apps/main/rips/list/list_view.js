define(["app",
        "tpl!apps/main/rips/list/templates/rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-list.tpl",
        "tpl!apps/main/rips/list/templates/no-rips.tpl",
        "tpl!apps/main/rips/list/templates/rips-item.tpl",
        "tpl!apps/main/rips/list/templates/rips-stats-graph.tpl",
        "tpl!apps/main/rips/list/templates/new_rips_templates/no-rips.tpl",
        "tpl!apps/main/rips/list/templates/new_rips_templates/new-rips-item.tpl",
        "tpl!apps/main/rips/list/templates/new_rips_templates/new-rips-list.tpl",
        "datatablesbootstrap", "morris",
        "bootstrap-notify"],

function(RipManager, ripsTpl, ripsListTpl, noRipsTpl, ripItemTpl, ripsStatsGraphTpl, noNewRipsTpl, newRipItemTpl, newRipsListTpl){
  RipManager.module("RipsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    //made this little fucker so that i can hopefully make sub views that use regions
    View.RipsListLayout = Marionette.LayoutView.extend({
      className: "right-side",
      template: ripsTpl,
     
      regions: {
        ripsTableRegion: "#rips-table-container",
        dialogRegion: "#dialog-region",
        ripsStatsGraphRegion: "#rips-stats-graph",
        newRipsTableRegion: "#new-rips-table-container"
      }
    });

    View.ripsStatsGraph = Marionette.ItemView.extend({
      template: ripsStatsGraphTpl,

      totalRipsAreaGraph: null,

      onDomRefresh: function() {
        //check if its null before making a call out
        if(!this.totalRipsAreaGraph) {
          var data = [];
          var modelGraphData = this.options.totalRipsGraph;

          for(var i=0 ; i<modelGraphData.length ; i++) {
            data.push({
              time: modelGraphData[i].attributes.day,
              rips: modelGraphData[i].attributes.rips
            });
          }

          //access the model to get the data
          this.totalRipsAreaGraph = new Morris.Area({
            element: 'rips-chart',
            resize: true,
            data: data,
            xkey: 'time',
            ykeys: ['rips'],
            labels: ['Rips: '],
            lineColors: ['#a0d0e0'], //'#3c8dbc', 
            hideHover: 'auto'
          });
        }
      },

      serializeData: function(){
        return {
          totalRipsGraph: this.options.totalRipsGraph,
        };
      }
    });

    //View.Rip is a row view that belongs to a composite view! This allows us to pass the model
    //and stuff when we do events and stuff (i think)
    View.Rip = Marionette.ItemView.extend({

      template: ripItemTpl,
      tagName: "tr",
      
      triggers:{
        "click td button.rip-edit": "rip:edit",
        "click td button.rip-report": "rip:report"
      },

      events:{
        "rip:edit": "highlightRow"
      },

      onRender: function(){
        this.$el.find(".flag-tooltip").tooltip();
      },

      initialize: function(){
        this.listenTo(this.model, 'change', this.updateDataTable, this);
        this.listenTo(this, "rip:edit", this.highlightRow); 
        this.listenTo(this, "remove:highlightrow", this.removeHighlightRow);
      },

      getTopFlagsForDisplay: function(){
        var me = this;
        var start = 0;
        var topFlags = new Array();
        var rawCountries = [];
        var rawCountryData = this.model.attributes.country_dist;

        if($.inArray(",", rawCountryData) > 0){
          //double or more
          rawCountries = rawCountryData.split(",");
        } else{
          //single
          rawCountries.push(rawCountryData);
        }

        //create arr of objects
        var formattedCountries = [];
        $.each(rawCountries, function(idx, countryName){
          var splitArr = countryName.split(":");
          var country = splitArr[0].split(' ').join('_') + ".png";
          var value = splitArr[1];
          var returnObj = {};
          returnObj.name = splitArr[0];
          returnObj.url = country;
          returnObj.hits = value;
          formattedCountries.push(returnObj);
        });
        
        $.each(formattedCountries, function(idx, country){
          if(idx < 5)
            topFlags.push(country);
        });

        return topFlags;
        
      },

      updateDataTable: function(e){
        var dt = $("#rips-table").dataTable();
        //update the grid with latest data DONT REDRAW (4th param false)
        dt.fnUpdate(this.model.attributes.redirect_rate, this._index, 1, false); //redirect rate
        dt.fnUpdate("<a href='" + this.model.attributes.replacement_links + "'>" + this.model.attributes.offer_name + "</a>", this._index, 3, false); //replacement link
      },

      highlightRow: function(e){
        //highlight the current row
        this.$el.addClass("rips-row-edit-highlight");
      },

      removeHighlightRow: function(e){
        //when dialog closed remove highlight
        this.$el.removeClass("rips-row-edit-highlight");
      },

      serializeData: function(){
        var model = this.model.toJSON();
        model.admin = RipManager.session.get("admin");
        model.topFlags = this.getTopFlagsForDisplay();

        return model;
      }

      
    });

    //basically useless view for the composite view
    var noRipsView = Marionette.ItemView.extend({
      template: noRipsTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.Rips = Marionette.CompositeView.extend({
    id: "rips-table",
    tagName: "table",
    className: "display dataTable",
    template: ripsListTpl,
    emptyView: noRipsView,
    childView: View.Rip,
    childViewContainer: "tbody",

    initialize: function(){
      this.listenTo(this, "rip:edit:notify", this.notify); 
      this.listenTo(this.collection, "reset", function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.append(childView.el);
        }
      });
    },

    notify: function(data, type) {

      var notifyOptions = {
        icon: 'glyphicon glyphicon-refresh glyphicon-refresh-animate',
        title: "Updating Ripped Url: ",
        message: "",
        // url: 'https://github.com/mouse0270/bootstrap-notify',
        //target: '_blank'
      };

      var otherOptions = {
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        newest_on_top: false,
        placement: {
          from: "top",
          align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 1,
        timer: 800,
        url_target: '_blank',
        mouse_over: null,
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          // '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>' 
      };

      if(type=="danger"){
        notifyOptions.title = "<strong>Failed to Update Rip</strong> <br />Please Stand by, one of our surfer dude coder guys will investigate this shortly.";
        notifyOptions.icon = "glyphicon glyphicon-warning-sign";
        otherOptions.delay = 0;
      }

      var notify = $.notify(notifyOptions,otherOptions);


      setTimeout(function() {
        notify.update('message', data);
      }, 850);


    },

    onRenderCollection: function(){
      this.attachHtml = function(collectionView, childView, index){
        collectionView.$el.prepend(childView.el);
      }

    
    },

    onDomRefresh: function() {
        $("#rips-table").dataTable({
          "deferRender": true,
          "aoColumnDefs": [
          //     { "sWidth": "80px", "aTargets": [0] },
          //     { "sWidth": "115px", "aTargets": [1] },
          //     { "sWidth": "420px", "aTargets": [2] },
          //     { "sWidth": "280px", "aTargets": [3] },
          //     { "sWidth": "155px", "aTargets": [4] },
          //     { "sWidth": "145px", "aTargets": [5] },
              {  "bSortable": false, "aTargets": [6] }
          ],
          // "order": [[ 1, 'desc' ]] doesn't work...
          // iDisplayLength: 25
        });
        $("#rips-table").addClass("table table-bordered table-hover");
        $("#rips-table").dataTable().fnSort([[0, 'desc']])
      }
    });


    //NEW RIPPED GRID VIEWS HERE
    View.NewRip = Marionette.ItemView.extend({

      template: newRipItemTpl,
      tagName: "tr",
      
      triggers:{
      },

      events:{
      },

      onRender: function(){
      },

      initialize: function(){
      },

      updateDataTable: function(e){
      },

      // serializeData: function(){
      //   var model = this.model.toJSON();
      //   model.admin = RipManager.session.get("admin");
      //   model.topFlags = this.getTopFlagsForDisplay();

      //   return model;
      // }
    });

    //basically useless view for the composite view
    var noNewRipsView = Marionette.ItemView.extend({
      template: noNewRipsTpl,
      tagName: "tr",
      className: "alert"
    });

    //the composite view, this should combine all the magic
    //and show us an amazing table...
    View.NewRips = Marionette.CompositeView.extend({
    id: "new-rips-table",
    tagName: "table",
    className: "display dataTable",
    template: newRipsListTpl,
    emptyView: noNewRipsView,
    childView: View.NewRip,
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
        $("#new-rips-table").dataTable({
          "deferRender": true,
           "aoColumnDefs": [
            // { "sWidth":"80%", "sClass": "new-rips-url-col", "aTargets": [0] },
            // { "sWidth":"20%", "aTargets": [1] }
           ],
          // "order": [[ 1, 'desc' ]] doesn't work...
          bLengthChange: false,
          bFilter: false,
          iDisplayLength: 5,


        });
        $("#new-rips-table").addClass("table table-bordered table-hover");
        $("#new-rips-table").dataTable().fnSort([[1, 'desc']])
      }
    });

  });
  return RipManager.RipsApp.List.View;
});
