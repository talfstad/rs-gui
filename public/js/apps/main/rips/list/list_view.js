define(["app",
        "tpl!apps/main/main/main_layout.tpl", 
        "tpl!apps/main/rips/list/templates/list_item.tpl",
        "tpl!apps/main/rips/list/templates/none.tpl",
        "tpl!apps/main/rips/list/templates/list.tpl"],
       function(RipManager, layoutTpl, listItemTpl, noneTpl, listTpl){
  RipManager.module("RipsApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){
    

    View.Rip = Marionette.ItemView.extend({
      tagName: "tr",
      template: listItemTpl,

      triggers: {
        "click td a.js-edit": "rip:edit"
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
      className: "table table-hover right-side",
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
