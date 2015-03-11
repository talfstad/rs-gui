define(["app"], function(RipManager){
  RipManager.module("GetRips", function(GetRips, RipManager, Backbone, Marionette, $, _){
    GetRips.Rip = Backbone.Model.extend({
      urlRoot: "/update_ripped_url",

      events: {

      },

      defaults: {
        "id": "",
        "links_list": "",
        "user": "",
        "uuid": "",
        "url": "",
        "hits": 0,
        "full_url": "",
        "replacement_links": "",
        "split_test_links": null,
        "split_test": 0,
        "daily_hits": 0,
        "notes": null,
        "redirect_rate": 0,
        "date_ripped": "",
        "last_updated": "",
        "country_dist": ""
      },

      validation: {
        redirect_rate: {
            required: true,
            range: [0, 100]
        },
        replacement_links: {
            required: true,
            pattern: 'url'
        }
      }

    });

    GetRips.RipCollection = Backbone.Collection.extend({
      url: "/ripped",
      model: GetRips.Rip
    });

    var API = {
      getRips: function(){
        var rips = new GetRips.RipCollection();
        var defer = $.Deferred();
        rips.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },

      mockRips: function(){
        var mockData = [
          {
            "id": 80,
            "url": "http://muscleandhealth.com-ii.co/uk/mh/affleck4.html",
            "full_url": "http://muscleandhealth.com-ii.co/uk/mh/affleck4.html?voluumdata=vid..00000005-8a80-43be-8000-000000000000__vpid..05e81800-9290-11e4-8c77-18d5f841007a__caid..c15e874a-61d1-4779-8b2d-6d68f88a9c7f__lid..f0399138-d7fa-4a24-8e8e-f8ad779efebe__rt..R__oid1..0848bbf1-6392-4df2-af75-c7460432e030__oid2..085d87d3-95bf-4dc9-bc0f-e2179d4e1d0f__var1..30__var2..42165__var3..affleck&source=30&creative=42165&cid=affleck",
            "hits": 30254,
            "jacks": 0,
            "notes": null,
            "redirect_rate": 12,
            "date_ripped": null,
            "last_updated": "2015-02-08T21:25:04.000Z",
            "replacement_links": "http://z6m.go2cloud.org/aff_c?offer_id=46&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "country_dist": "GB:9584,US:38",
            "daily_hits": 0,
            "daily_jacks": 0
          },
          {
            "id": 81,
            "url": "http://muscleandhealth.com-ii.co/uk/mh/butler4.html",
            "full_url": "http://muscleandhealth.com-ii.co/uk/mh/butler4.html?voluumdata=vid..00000000-87f2-47cc-8000-000000000000__vpid..17f58800-91b6-11e4-8f0b-77001abdd35a__caid..718e5c32-4732-4479-8854-fc12459393bb__lid..55597990-2eb3-4657-b4c9-2977541c639a__rt..R__oid1..0848bbf1-6392-4df2-af75-c7460432e030__oid2..085d87d3-95bf-4dc9-bc0f-e2179d4e1d0f__var1..633__var2..16595__var3..butler&source=633&creative=16595&cid=butler",
            "hits": 8129,
            "jacks": 0,
            "notes": null,
            "redirect_rate": 12,
            "date_ripped": null,
            "last_updated": "2015-01-25T18:23:15.000Z",
            "replacement_links": "http://z6m.go2cloud.org/aff_c?offer_id=68&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "country_dist": "GB:228",
            "daily_hits": 0,
            "daily_jacks": 0
          },
          {
            "id": 82,
            "url": "http://muscleandhealth.com-ii.co/uk/mh/affleck2.html",
            "full_url": "http://muscleandhealth.com-ii.co/uk/mh/affleck2.html?voluumdata=vid..00000002-ed7e-4d87-8000-000000000000__vpid..d17e2800-a5bf-11e4-8fb6-6f62d1f3db86__caid..c15e874a-61d1-4779-8b2d-6d68f88a9c7f__lid..bc599be7-b2b8-4138-b040-8f6117b1cca1__rt..R__oid1..f68d6b7a-9988-460f-9ada-dc6aa3ca7457__oid2..ba014b2c-e849-40b5-b1ea-d961b6d8576a__var1..6504__var2..42165__var3..affleck&source=6504&creative=42165&cid=affleck",
            "hits": 17944,
            "jacks": 0,
            "notes": "power pro uk",
            "redirect_rate": 12,
            "date_ripped": null,
            "last_updated": "2015-02-10T08:42:35.000Z",
            "replacement_links": "http://z6m.go2cloud.org/aff_c?offer_id=82&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "country_dist": "GB:13222,UNKNOWN:76,US:30",
            "daily_hits": 0,
            "daily_jacks": 0
          },
          {
            "id": 83,
            "url": "http://muscleandhealth.com-ii.co/uk/mh/rock4b.html",
            "full_url": "http://muscleandhealth.com-ii.co/uk/mh/rock4b.html?voluumdata=vid..00000005-587e-47a6-8000-000000000000__vpid..2cbad000-8df2-11e4-8d87-ec71dc3acbf4__caid..718e5c32-4732-4479-8854-fc12459393bb__lid..bb6ad0af-13cb-4cf8-b0a9-95dda47b6fe6__rt..R__oid1..0848bbf1-6392-4df2-af75-c7460432e030__oid2..085d87d3-95bf-4dc9-bc0f-e2179d4e1d0f__var1..2734__var2..69414__var3..1&source=2734&creative=69414&cid=1",
            "hits": 78007,
            "jacks": 0,
            "notes": null,
            "redirect_rate": 12,
            "date_ripped": null,
            "last_updated": "2015-02-06T19:25:34.000Z",
            "replacement_links": "http://z6m.go2cloud.org/aff_c?offer_id=68&aff_id=1006&aff_sub=CJ25-54&aff_sub2={var2}&aff_sub3={clickid}",
            "country_dist": "GB:5504",
            "daily_hits": 0,
            "daily_jacks": 0
          }];

          var mockRips = new GetRips.RipCollection(mockData);

          return mockRips;

      }

    };

    RipManager.reqres.setHandler("rips:getrips", function(){
      return API.getRips();
    });
   
  });

});
