define(["app",
        "tpl!apps/rips/list/templates/layout.tpl",
        "tpl!apps/rips/list/templates/panel.tpl",
        "tpl!apps/rips/list/templates/none.tpl",
        "tpl!apps/rips/list/templates/list.tpl",
        "tpl!apps/rips/list/templates/list_item.tpl"],
       function(RipManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  RipManager.module("RipsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        panelRegion: "#panel-region",
        ripsRegion: "#rips-region"
      }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        "click button.js-new": "rip:new"
      },

      events: {
        "submit #filter-form": "filterRips"
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },

      filterRips: function(e){
        e.preventDefault();
        var criterion = this.$(".js-filter-criterion").val();
        this.trigger("rips:filter", criterion);
      },

      onSetFilterCriterion: function(criterion){
        this.ui.criterion.val(criterion);
      }
    });

    View.Rip = Marionette.ItemView.extend({
      tagName: "tr",
      template: listItemTpl,

      triggers: {
        "click td a.js-show": "rip:show",
        "click td a.js-edit": "rip:edit",
        "click button.js-delete": "rip:delete"
      },

      events: {
        "click": "highlightName"
      },

      flash: function(cssClass){
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function(){
          setTimeout(function(){
            $view.toggleClass(cssClass)
          }, 500);
        });
      },

      highlightName: function(e){
        this.$el.toggleClass("warning");
      },

      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
    });

    var NoRipsView = Marionette.ItemView.extend({
      template: noneTpl,
      tagName: "tr",
      className: "alert"
    });

    View.Rips = Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoRipsView,
      childView: View.Rip,
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
      }
    });
  });

  return RipManager.RipsApp.List.View;
});
