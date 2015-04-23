define(["app", "apps/main/rips/list/list_view"], function(RipManager, RipsListView){

  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["apps/main/rips/list/list_model",
                 "apps/main/offers/list/list_model",
                 "common/loading_view",
                 "apps/main/rips/edit/edit_view",
                 "apps/main/rips/list/rips_stats_model",
                 "apps/main/rips/report/report_dialog_view",
                 "apps/main/rips/report/report_model"], function(getRipsModel, getOffersModel, LoadingView, EditRipView, RipsStatsModel, ReportRipView){

          var ripsListLayout = new RipsListView.RipsListLayout();
          ripsListLayout.render();

          RipManager.mainLayout.mainRegion.show(ripsListLayout);


          ripsListLayout.ripsStatsGraphRegion.show(new LoadingView.Loading());
          ripsListLayout.ripsTableRegion.show(new LoadingView.Loading());

          var newRipsGridLayout = new RipsListView.NewRipsListGridLayout();
          newRipsGridLayout.render();
          ripsListLayout.newRipsGridRegion.show(newRipsGridLayout);

          newRipsGridLayout.newRipsTableRegion.show(new LoadingView.Loading());

          var fetchingNewRips = RipManager.request("rips:getnewrips");
          var fetchingRipsStatsGraph = RipManager.request("rips:stats");
          var fetchingRips = RipManager.request("rips:getrips");
          var fetchingOffers = RipManager.request("offers:getoffers");

          //NEW RIPS
          $.when(fetchingNewRips).done(function(rips){
            var newRipsListView = new RipsListView.NewRips({
              collection: rips,
            });

            var numberOfNewRipsView = new RipsListView.NumberOfNewRips({
              numberOfRips: rips.models.length
            });

            try {
              newRipsGridLayout.numberOfNewRipsRegion.show(numberOfNewRipsView);
              newRipsGridLayout.newRipsTableRegion.show(newRipsListView);
            } catch(e){}

          });

          //TOTAL RIPS GRAPH
          $.when(fetchingRipsStatsGraph).done(function(totalRippedHitsData){
            //create view
            var totalRipsStatsGraph = new RipsListView.ripsStatsGraph({
              totalRipsGraph: totalRippedHitsData.models,
            });
        
            //show
            try {
              ripsListLayout.ripsStatsGraphRegion.show(totalRipsStatsGraph);
            } catch(e){}
          });


          //LIST RIP EDIT GRID
          $.when(fetchingRips).done(function(rips){
            var ripsListView = new RipsListView.Rips({
                collection: rips
            });

            var saveRipSuccess = function(model, message, other) {
              ripsListView.trigger("rip:edit:notify", message.success, "success");
            };

            var saveRipError = function(model, message, other) {
              ripsListView.trigger("rip:edit:notify", message.error, "danger");
              model.set(model.previousAttributes());
            };

            $.when(fetchingOffers).done(function(offers){
              //first check if main application has loaded, must load that first
              //it sets up some main things for the main app including left nav
              //the main layout, etc. TODO
             
              ripsListView.on("childview:rip:edit", function(viewTestTodo, args){

                var model = args.model;

                //TODO pass offer list to view as well but don't let it be
                //part of the model so on save it doesnt do weird shit

                var view = new EditRipView.Rip({
                  model: model,
                  offerList: offers
                });

                view.on("rip:edit:submit", function(data){
                  
                  if(this.model.isValid(true)) {
                    model.save(data, {success: saveRipSuccess, error: saveRipError});
                    view.closeDialog();
                  } else {
                    //TODO This doesn't contain the actual previous attr right now
                    //because of the validation (i think)
                    view.model.set(view.model.previousAttributes());
                  }
                  
                });


                view.on("close", function(){
                  args.view.trigger("remove:highlightrow");
                });

                view.showDialog();
              });
            });

            ripsListView.on("childview:rip:report", function(viewTestTodo, args){

              var dialogShownCallback = function(){
                //get graph data!
                var fetchOverviewGraphData = RipManager.request("report:overviewGraphData", model.id);
                $.when(fetchOverviewGraphData).done(function(overviewGraphData){
                  //create view
                  var reportHitsJacksGraphView = new ReportRipView.ReportHitsJacksGraphDialog({
                    model: model,
                    overviewGraphData: overviewGraphData
                  });
                  var reportCountriesGraphView = new ReportRipView.ReportCountriesGraphDialog({
                    model: model
                  });
                  
                  ripReportLayout.ripsStatsGraphRegion.show(reportHitsJacksGraphView);
                  ripReportLayout.countriesRegion.show(reportCountriesGraphView);
                 
                });
              };
            
              var model = args.model;
              
              //create the layout, show the layout as dialog and show the loading for each region
              var ripReportLayout = new ReportRipView.RipReportDialogLayout({model: model});
              
              ripReportLayout.showDialog(dialogShownCallback);

              ripReportLayout.ripsStatsGraphRegion.show(new LoadingView.Loading());
              ripReportLayout.countriesRegion.show(new LoadingView.Loading());
              
              ripReportLayout.on("close", function(){
                args.view.trigger("remove:highlightrow");
              });

              
            });

            
           
            try {
              ripsListLayout.ripsTableRegion.show(ripsListView);
            } catch(e){}
            
          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});