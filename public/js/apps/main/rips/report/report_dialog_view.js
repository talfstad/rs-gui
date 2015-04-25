define(["app", "tpl!apps/main/rips/report/templates/report_dialog.tpl",
        "tpl!apps/main/rips/report/templates/report_hits_jacks_graph_dialog.tpl",
        "tpl!apps/main/rips/report/templates/report_countries_graph_dialog.tpl",
        "bootstrap-dialog", "morris", "worldmap"], function(RipManager, ReportDialogTemplate, ReportDialogHitsJacksGraph, ReportDialogCountriesGraph, BootstrapDialog){
  RipManager.module("RipsApp.ReportDialog.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.RipReportDialogLayout = Marionette.LayoutView.extend({

      template: ReportDialogTemplate,
      reportByHourDrawn: false,


      regions: {
        ripsStatsGraphRegion: "#report-hits-jacks-graph",
        countriesRegion: "#world-map-countries-container"
      },

      triggers: {
        "click button.js-close" : "close"
      },

      showDialog: function(callback){
          var me = this;
          this.render();
          
          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: '<h5><strong>Rip Report:</strong> ' + this.model.attributes.url + '</h5>',
            message: this.$el,
            cssClass: 'login-dialog',
            onhide: function(dialogRef){
              me.trigger("close");
            },
            onshown: callback,
            buttons: [{
              label: 'Close',
              action: function(dialogRef) {
                  dialogRef.close();
              }
            }],
            draggable: true
          });
        },

        closeDialog: function(e){
          BootstrapDialog.closeAll();
        },

    });



    View.ReportHitsJacksGraphDialog = Marionette.ItemView.extend({
        overviewGraphDataGraph: null,
        template: ReportDialogHitsJacksGraph,
      
      numbersWithCommas: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },

      onShow: function(dialogRef){
        var me = this;

           
          //ARCHIVED GRAPH STUFF LAST 30 DAYS
          var archivedHitsJacksData = [];
          var archivedGraphData = this.options.overviewGraphData.models[0].attributes.daily_stats;
        
          for(var i=0 ; i<archivedGraphData.length ; i++) {
            archivedHitsJacksData.push({
              time: archivedGraphData[i].day,
              jacks: archivedGraphData[i].jacks,
              rippedHits: archivedGraphData[i].hits
            });
          }
  
          archivedHitsJacksData.reverse();

          this.overviewGraphDataGraph = new Morris.Area({
            element: 'rip-report-overview-chart',
            resize: true,
            data: archivedHitsJacksData,
            hoverCallback: function(index, options, content) {
              var item = options.data[index];
              
              var percentJacked = (item.jacks / item.rippedHits) * 100;
              if(isNaN(percentJacked)) {
                percentJacked = 0;
              }
              var html = "<div class='morris-hover-row-label'>"+ item.time +"</div><div class='morris-hover-point' style='color: #3c8dbc'>" +
                          "Ripped Hits: " +
                          me.numbersWithCommas(item.rippedHits) +
                          "</div>" +
                          "<div class='morris-hover-point' style='color: #f39c12'>" +
                          "Jacks: " +
                          me.numbersWithCommas(item.jacks) +
                          "</div>" + 
                          "<div class='morris-hover-point' style='color: #fff'>" +
                          percentJacked.toFixed(2) + "% Total Jacked" +
                          "</div>";

                return(html);
            },
            xkey: 'time',
            ykeys: ['jacks', 'rippedHits'],
            labels: ['Jacks: ', 'Ripped Hits: '],
            lineColors: [ '#f39c12','#3c8dbc'],
            fillOpacity: 0.1,
            hideHover: 'auto'
          });


        //HOURLY GRAPH STUFF    
        var hourlyHitsJacksData = [];
        var hourlyGraphData = this.options.overviewGraphData.models[0].attributes.hourly_stats;


        for(var i=0 ; i<hourlyGraphData.length ; i++) {
          hourlyHitsJacksData.push({
            time: hourlyGraphData[i].hour,
            jacks: hourlyGraphData[i].jacks,
            rippedHits: hourlyGraphData[i].hits
          });
        }

        // hourlyHitsJacksData.reverse();

        this.hourlyGraph = new Morris.Area({
          element: 'rip-report-hourly-chart',
          resize: true,
          data: hourlyHitsJacksData,
          hoverCallback: function(index, options, content) {
            var item = options.data[index];
            var date = new Date(item.time)
            var formattedTime = "";
            if(date.getHours() > 9) {
              formattedTime = date.getHours() + ":00 Hours";
            } else {
              formattedTime = "0" + date.getHours() + ":00 Hours";
            }
            var percentJacked = (item.jacks / item.rippedHits) * 100;
            if(isNaN(percentJacked)) {
              percentJacked = 0;
            }

            var html = "<div class='morris-hover-row-label'>"+ formattedTime +"</div><div class='morris-hover-point' style='color: #3c8dbc'>" +
                        "Ripped Hits: " +
                        me.numbersWithCommas(item.rippedHits) +
                        "</div>" +
                        "<div class='morris-hover-point' style='color: #f39c12'>" +
                        "Jacks: " +
                        me.numbersWithCommas(item.jacks) +
                        "</div>" + 
                        "<div class='morris-hover-point' style='color: #fff'>" +
                        percentJacked.toFixed(2) + "% Total Jacked" +
                        "</div>";

              return(html);
          },
          xkey: 'time',
          ykeys: ['jacks', 'rippedHits'],
          labels: ['Jacks: ', 'Ripped Hits: '],
          lineColors: [ '#f39c12','#3c8dbc'],
          fillOpacity: 0.1,
          hideHover: 'auto'
        });

        //HACK to make the morris grid redraw when the hourly tab is shown
        // need to do this because morris is kind of shitty
        $('#report-by-the-hour').on('shown.bs.tab', function (e) {
            me.hourlyGraph.redraw();
        });

        
      },

        serializeData: function(){
          return {
            model: this.model.toJSON(),
            overviewGraphData: this.options.overviewGraphData.toJSON()
          };
        }
      });



      View.ReportCountriesGraphDialog = Marionette.ItemView.extend({
        overviewGraphDataGraph: null,
        template: ReportDialogCountriesGraph,
        
        initialize: function() {
          
          var countries = new Array();
          countries['Andorra'] = [42.546245, 1.601554];
          countries['United Arab Emirates'] = [23.424076, 53.847818];
          countries['Afghanistan'] = [33.93911,  67.709953];
          countries['Antigua and Barbuda'] = [17.060816, -61.796428];
          countries['Anguilla'] = [18.220554, -63.068615];
          countries['Albania'] = [41.153332, 20.168331 ];
          countries['Armenia'] = [40.069099, 45.038189 ];
          countries['Netherlands Antilles'] = [12.226079, -69.060087];
          countries['Angola'] = [-11.202692,  17.873887 ];
          countries['Antarctica'] = [-75.250973,  -0.071389];
          countries['Argentina'] = [-38.416097,  -63.616672];
          countries['American Samoa'] = [-14.270972,  -170.132217];
          countries['Austria'] = [47.516231, 14.550072];
          countries['Australia'] = [-25.274398,  133.775136];
          countries['Aruba'] = [12.52111,  -69.968338 ];
          countries['Azerbaijan'] = [40.143105, 47.576927];
          countries['Bosnia and Herzegovina'] = [43.915886, 17.679076];
          countries['Barbados'] = [13.193887, -59.543198];
          countries['Bangladesh'] = [23.684994, 90.356331];
          countries['Belgium'] = [50.503887, 4.469936];
          countries['Burkina Faso'] = [12.238333, -1.561593];
          countries['Bulgaria'] = [42.733883, 25.48583 ];
          countries['Bahrain'] = [25.930414, 50.637772 ];
          countries['Burundi'] = [-3.373056, 29.918886];
          countries['Benin'] = [9.30769, 2.315834 ];
          countries['Bermuda'] = [32.321384, -64.75737 ];
          countries['Brunei'] = [4.535277,  114.727669 ];
          countries['Bolivia'] = [-16.290154,  -63.588653];
          countries['Brazil'] = [-14.235004,  -51.92528 ];
          countries['Bahamas'] = [25.03428,  -77.39628];
          countries['Bhutan'] = [27.514162, 90.433601 ];
          countries['Bouvet Island'] = [-54.423199,  3.413194];
          countries['Botswana'] = [-22.328474,  24.684866 ];
          countries['Belarus'] = [53.709807, 27.953389];
          countries['Belize'] = [17.189877, -88.49765];
          countries['Canada'] = [56.130366, -106.346771];
          countries['Cocos [Keeling] Islands'] = [-12.164165,  96.870956];
          countries['Congo [DRC]'] = [-4.038333, 21.758664];
          countries['Central African Republic'] = [6.611111,  20.939444];
          countries['Congo [Republic]'] = [-0.228021, 15.827659];
          countries['Switzerland'] = [46.818188, 8.227512];
          countries['Cook Islands'] = [-21.236736,  -159.777671];
          countries['Chile'] = [-35.675147,  -71.542969 ];
          countries['Cameroon'] = [7.369722,  12.354722 ];
          countries['China'] = [35.86166,  104.195397];
          countries['Colombia'] = [4.570868,  -74.297333];
          countries['Costa Rica'] = [9.748917,  -83.753428];
          countries['Cuba'] = [21.521757, -77.781167];
          countries['Cape Verde'] = [16.002082, -24.013197];
          countries['Christmas Island'] = [-10.447525,  105.690449];
          countries['Cyprus'] = [35.126413, 33.429859 ];
          countries['Czech Republic'] = [49.817492, 15.472962];
          countries['Germany'] = [51.165691, 10.451526];
          countries['Djibouti'] = [11.825138, 42.590275];
          countries['Denmark'] = [56.26392,  9.501785];
          countries['Dominica'] = [15.414999, -61.370976];
          countries['Dominican Republic'] = [18.735693, -70.162651 ];
          countries['Algeria'] = [28.033886, 1.659626 ];
          countries['Ecuador'] = [-1.831239, -78.183406];
          countries['Estonia'] = [58.595272, 25.013607];
          countries['Egypt'] = [26.820553, 30.802498 ];
          countries['Western Sahara'] = [24.215527, -12.885834];
          countries['Eritrea'] = [15.179384, 39.782334];
          countries['Spain'] = [40.463667, -3.74922];
          countries['Ethiopia'] = [9.145, 40.489673];
          countries['Finland'] = [1.92411, 25.7481516];
          countries['Fiji'] = [-16.578193,  179.414413];
          countries['Falkland Islands [Islas Malvinas]'] = [-51.796253,  -59.523613];
          countries['Micronesia'] = [7.425554,  150.550812];
          countries['Faroe Islands'] = [61.892635, -6.911806];
          countries['France'] = [46.227638, 2.213749];
          countries['Gabon'] = [-0.803689, 11.609444];
          countries['United Kingdom'] = [55.378051, -3.435973];
          countries['Grenada'] = [12.262776, -61.604171 ];
          countries['Georgia'] = [42.315407, 43.356892 ];
          countries['French Guiana'] = [3.933889,  -53.125782];
          countries['Guernsey'] = [49.465691, -2.585278];
          countries['Gibraltar'] = [36.137741, -5.345374];
          countries['Greenland'] = [71.706936, -42.604303];
          countries['Gambia'] = [13.443182, -15.310139];
          countries['Guinea'] = [9.945587,  -9.696645];
          countries['Guadeloupe'] = [16.995971, -62.067641];
          countries['Equatorial Guinea'] = [1.650801,  10.267895];
          countries['Greece'] = [39.074208, 21.824312];
          countries['South Georgia and the South Sandwich Islands'] = [-54.429579,  -36.587909];
          countries['Guatemala'] = [15.783471, -90.230759];
          countries['Guam'] = [13.444304, 144.793731 ];
          countries['Guinea-Bissau'] = [11.803749, -15.180413];
          countries['Guyana'] = [4.860416,  -58.93018 ];
          countries['Gaza Strip'] = [31.354676, 34.308825 ];
          countries['Hong Kong'] = [22.396428, 114.109497];
          countries['Heard Island and McDonald Islands'] = [-53.08181, 73.504158 ];
          countries['Honduras'] = [15.199999, -86.241905];
          countries['Croatia'] = [45.1,  15.2];
          countries['Haiti'] = [18.971187, -72.285215];
          countries['Hungary'] = [47.162494, 19.503304];
          countries['Indonesia'] = [-0.789275, 113.921327];
          countries['Ireland'] = [53.41291,  -8.24389];
          countries['Israel'] = [31.046051, 34.851612];
          countries['Isle of Man'] = [54.236107, -4.548056];
          countries['British Indian Ocean Territory'] = [-6.343194, 71.876519];
          countries['Iraq'] = [33.223191, 43.679291];
          countries['Iran'] = [32.427908, 53.688046];
          countries['Iceland'] = [64.963051, -19.020835];
          countries['Italy'] = [41.87194,  12.56738];
          countries['Jersey'] = [49.214439, -2.13125];
          countries['Jamaica'] = [18.109581, -77.297508];
          countries['Jordan'] = [30.585164, 36.238414];
          countries['Japan'] = [36.204824, 138.252924];
          countries['Kenya'] = [-0.023559, 37.906193];
          countries['Kyrgyzstan'] = [41.20438,  74.766098];
          countries['Cambodia'] = [12.565679, 104.990963];
          countries['Kiribati'] = [-3.370417, -168.734039];
          countries['Comoros'] = [-11.875001,  43.872219];
          countries['Saint Kitts and Nevis'] = [17.357822, -62.782998];
          countries['North Korea'] = [40.339852, 127.510093];
          countries['South Korea'] = [35.907757, 127.766922];
          countries['Kuwait'] = [29.31166,  47.481766];
          countries['Cayman Islands'] = [19.513469, -80.566956];
          countries['Kazakhstan'] = [48.019573, 66.923684];
          countries['Laos'] = [19.85627,  102.495496];
          countries['Lebanon'] = [33.854721, 35.862285];
          countries['Saint Lucia'] = [13.909444, -60.978893];
          countries['Liechtenstein'] = [47.166,  9.555373];
          countries['Sri Lanka'] = [7.873054,  80.771797];
          countries['Liberia'] = [6.428055,  -9.429499];
          countries['Lesotho'] = [-29.609988,  28.233608];
          countries['Lithuania'] = [55.169438, 23.881275];
          countries['Luxembourg'] = [49.815273, 6.129583];
          countries['Latvia'] = [56.879635, 24.603189];
          countries['Libya'] = [26.3351, 17.228331];
          countries['Morocco'] = [31.791702, -7.09262];
          countries['Monaco'] = [43.750298, 7.412841];
          countries['Moldova'] = [47.411631, 28.369885];
          countries['Montenegro'] = [42.708678, 19.37439];
          countries['Madagascar'] = [-18.766947,  46.869107];
          countries['Marshall Islands'] = [7.131474,  171.184478];
          countries['Macedonia'] = [41.608635, 21.745275];
          countries['Mali'] = [17.570692, -3.996166];
          countries['Myanmar'] = [21.913965, 95.956223];
          countries['Mongolia'] = [46.862496, 103.846656];
          countries['Macau'] = [22.198745, 113.543873];
          countries['Northern Mariana Islands'] = [17.33083,  145.38469];
          countries['Martinique'] = [14.641528, -61.024174];
          countries['Mauritania'] = [21.00789,  -10.940835];
          countries['Montserrat'] = [16.742498, -62.187366];
          countries['Malta'] = [35.937496, 14.375416];
          countries['Mauritius'] = [-20.348404,  57.552152];
          countries['Maldives'] = [3.202778,  73.22068];
          countries['Malawi'] = [-13.254308,  34.301525];
          countries['Mexico'] = [23.634501, -102.552784];
          countries['Malaysia'] = [4.210484,  101.975766];
          countries['Mozambique'] = [-18.665695,  35.529562];
          countries['Namibia'] = [-22.95764, 18.49041];
          countries['New Caledonia'] = [-20.904305,  165.618042];
          countries['Niger'] = [17.607789, 8.081666];
          countries['Norfolk Island'] = [-29.040835,  167.954712];
          countries['Nigeria'] = [9.081999,  8.675277];
          countries['Nicaragua'] = [12.865416, -85.207229];
          countries['Netherlands'] = [52.132633, 5.291266];
          countries['Norway'] = [60.472024, 8.468946];
          countries['Nepal'] = [28.394857, 84.124008];
          countries['Nauru'] = [-0.522778, 166.931503];
          countries['Niue'] = [-19.054445,  -169.867233];
          countries['New Zealand'] = [-40.900557,  174.885971];
          countries['Oman'] = [21.512583, 55.923255];
          countries['Panama'] = [8.537981,  -80.782127];
          countries['Peru'] = [-9.189967, -75.015152];
          countries['French Polynesia'] = [-17.679742,  -149.406843];
          countries['Papua New Guinea'] = [-6.314993, 143.95555];
          countries['Philippines'] = [12.879721, 121.774017];
          countries['Pakistan'] = [30.375321, 69.345116];
          countries['Poland'] = [51.919438, 19.145136];
          countries['Saint Pierre and Miquelon'] = [46.941936, -56.27111];
          countries['Pitcairn Islands'] = [-24.703615,  -127.439308];
          countries['Puerto Rico'] = [18.220833, -66.590149];
          countries['Palestinian Territories'] = [31.952162, 35.233154];
          countries['Portugal'] = [39.399872, -8.224454];
          countries['Palau'] = [7.51498, 134.58252];
          countries['Paraguay'] = [-23.442503,  -58.443832];
          countries['Qatar'] = [25.354826, 51.183884];
          countries['Réunion'] = [-21.115141,  55.536384];
          countries['Romania'] = [45.943161, 24.96676];
          countries['Russia'] = [61.52401,  105.318756];
          countries['Rwanda'] = [-1.940278, 29.873888];
          countries['Saudi Arabia'] = [23.885942, 45.079162];
          countries['Solomon Islands'] = [-9.64571,  160.156194];
          countries['Seychelles'] = [-4.679574, 55.491977];
          countries['Sudan'] = [12.862807, 30.217636];
          countries['Sweden'] = [60.128161, 18.643501];
          countries['Singapore'] = [1.352083,  103.819836];
          countries['Saint Helena'] = [-24.143474,  -10.030696];
          countries['Slovenia'] = [46.151241, 14.995463];
          countries['Svalbard and Jan Mayen'] = [77.553604, 23.670272];
          countries['Slovakia'] = [48.669026, 19.699024];
          countries['Sierra Leone'] = [8.460555,  -11.779889];
          countries['San Marino'] = [43.94236,  12.457777];
          countries['Senegal'] = [14.497401, -14.452362];
          countries['Somalia'] = [5.152149,  46.199616];
          countries['Suriname'] = [3.919305, -56.027783 ];
          countries['São Tomé and Príncipe'] = [0.18636, 6.613081];
          countries['El Salvador'] = [13.794185, -88.89653];
          countries['Syria'] = [34.802075, 38.996815];
          countries['Swaziland'] = [-26.522503,  31.465866];
          countries['Turks and Caicos Islands'] = [21.694025, -71.797928];
          countries['Chad'] = [15.454166, 18.732207];
          countries['French Southern Territories'] = [-49.280366,  69.348557];
          countries['Togo'] = [8.619543,  0.824782];
          countries['Thailand'] = [15.870032, 100.992541];
          countries['Tajikistan'] = [38.861034, 71.276093];
          countries['Tokelau'] = [-8.967363, -171.855881];
          countries['Timor-Leste'] = [-8.874217, 125.727539];
          countries['Turkmenistan'] = [38.969719, 59.556278];
          countries['Tunisia'] = [33.886917, 9.537499];
          countries['Tonga'] = [-21.178986,  -175.198242];
          countries['Turkey'] = [38.963745, 35.243322];
          countries['Trinidad and Tobago'] = [10.691803, -61.222503];
          countries['Tuvalu'] = [-7.109535, 177.64933];
          countries['Taiwan'] = [23.69781,  120.960515];
          countries['Tanzania'] = [-6.369028, 34.888822];
          countries['Ukraine'] = [48.379433, 31.16558];
          countries['Uganda'] = [1.373333,  32.290275];
          countries['United States'] = [37.09024,  -95.712891];
          countries['Uruguay'] = [-32.522779,  -55.765835];
          countries['Uzbekistan'] = [41.377491, 64.585262];
          countries['Vatican City'] = [41.902916, 12.453389];
          countries['Saint Vincent and the Grenadines'] = [12.984305, -61.287228];
          countries['Venezuela'] = [6.42375, -66.58973];
          countries['British Virgin Islands'] = [18.420695, -64.639968];
          countries['U.S. Virgin Islands'] = [18.335765, -64.896335];
          countries['Vietnam'] = [14.058324, 108.277199];
          countries['Vanuatu'] = [-15.376706,  166.959158];
          countries['Wallis and Futuna'] = [-13.768752,  -177.156097];
          countries['Samoa'] = [-13.759029,  -172.104629];
          countries['Kosovo'] = [42.602636, 20.902977];
          countries['Yemen'] = [15.552727, 48.516388];
          countries['Mayotte'] = [-12.8275,  45.166244];
          countries['South Africa'] = [-30.559482,  22.937506];
          countries['Zambia'] = [-13.133897,  27.849332];
          countries['Zimbabwe'] = [-19.015438,  29.154857];
          this.countries = countries;
        },

        numbersWithCommas: function(number) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        onShow: function(dialogRef){
          var me = this;
         
          //create list of countries lat lon
          var markers = [];
          $.each(this.model.attributes.countries, function(idx, country){

            var latlon = me.getCountryLatLonByName(country.name);
            var middleText = "";
            if(country.hits > 1){
              middleText = " Hits in "; 
            } else {
              middleText = " Hit in ";
            }
            markers.push({
              latLng: latlon,
              name: country.hits + "|" + middleText + country.name + "|" + country.url,
            });
          });
          

          $('#world-map-markers').vectorMap({
            map: 'world_mill_en',
            normalizeFunction: 'polynomial',
            hoverOpacity: 0.7,
            hoverColor: false,
            backgroundColor: 'transparent',
            regionStyle: {
              initial: {
                fill: 'rgba(210, 214, 222, 1)',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
              },
              hover: {
                "fill-opacity": 0.7,
                cursor: 'pointer'
              },
              selected: {
                fill: 'yellow'
              },
              selectedHover: {
              }
            },
            onMarkerLabelShow: function(e, el, code){

              var text = el.html();
              var allData = text.split("|");
              var countryHits = allData[0];
              var countryName = allData[1];
              var countryUrl = allData[2];
              
              el.html("<img class='rips-grid-flag' src='/images/flags/"+ countryUrl +"' alt=''/> <strong>"+ me.numbersWithCommas(countryHits) + countryName+"</strong><br />");

              
            },
            onRegionLabelShow: function(e, el, code){

              var text = el.html();
              if(text === "United States of America"){
                text = "United States";
              }
              if(text === "Democratic Republic of the Congo" || text === "Republic of the Congo"){
                text = "Congo";
              }
              if(text === "South Sudan"){
                text = "Sudan";
              }
              var flag = text.split(' ').join('_');
              
              el.html("<img class='rips-grid-flag' src='/images/flags/"+ flag +".png' alt=''/> <strong>"+text+"</strong><br />");
            },
            markerStyle: {
              initial: {
                fill: '#00a65a',
                stroke: '#111'
              }
            },
            markers: markers
          });

        },

        getCountryLatLonByName: function(name){
          return this.countries[name];
        },

        // serializeData: function(){
        //   return {
        //     model: this.model.toJSON(),
        //     overviewGraphData: this.options.overviewGraphData.toJSON()
        //   };
        // }
      });
  });

  return RipManager.RipsApp.ReportDialog.View;
});