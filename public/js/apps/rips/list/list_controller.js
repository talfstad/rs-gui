define(["app", "apps/rips/list/list_view"], function(RipManager, View){
  RipManager.module("RipsApp.List", function(List, RipManager, Backbone, Marionette, $, _){
    List.Controller = {
      listRips: function(criterion){
        require(["entities/rip"], function(){
          //var loadingView = new CommonViews.Loading();
          //RipManager.mainRegion.show(loadingView);
          RipManager.trigger("leftnav:list");

          var fetchingRips = RipManager.request("rip:entities");

          var ripsListLayout = new View.Layout();
          var ripsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingRips).done(function(rips){
              var filteredRips = RipManager.Entities.FilteredCollection({
                collection: rips,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(rip){
                    if(rip.get('url').toLowerCase().indexOf(criterion) !== -1
                      || rip.get('hits').toLowerCase().indexOf(criterion) !== -1
                      || rip.get('rate').toLowerCase().indexOf(criterion) !== -1){
                        return rip;
                    }
                  };
                }
              });

              if(criterion){
                filteredRips.filter(criterion);
                ripsListPanel.once("show", function(){
                  ripsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var ripsListView = new View.Rips({
                collection: filteredRips
              });

              ripsListPanel.on("rips:filter", function(filterCriterion){
                filteredRips.filter(filterCriterion);
                RipManager.trigger("rips:filter", filterCriterion);
              });

              ripsListLayout.on("show", function(){
                ripsListLayout.panelRegion.show(ripsListPanel);
                ripsListLayout.ripsRegion.show(ripsListView);
              });

              ripsListView.on("childview:rip:show", function(childView, args){
                RipManager.trigger("rip:show", args.model.get("id"));
              });

              ripsListView.on("childview:rip:edit", function(childView, args){
                require(["apps/rips/edit/edit_view"], function(EditView){
                  var model = args.model;
                  var view = new EditView.Rip({
                    model: model
                  });

                  view.on("form:submit", function(data){
                    if(model.save(data)){
                      childView.render();
                      view.trigger("dialog:close");
                      childView.flash("success");
                    }
                    else{
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });

                  RipManager.dialogRegion.show(view);
                });
              });

              ripsListView.on("childview:rip:delete", function(childView, args){
                args.model.destroy();
              });

              RipManager.mainRegion.show(ripsListLayout);
            });
          });
        });
      }
    }
  });

  return RipManager.RipsApp.List.Controller;
});
