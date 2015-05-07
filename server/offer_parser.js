var express = require('express');
var request = require('request');
//var cheerio = require('cheerio');
var mysql = require('mysql');
var http = require('http');
var app = express();
var moment = require('moment');

var db = mysql.createConnection({
        host : '54.149.38.119',
        user : 'root',
        password : 'derekisfat',
        database : 'domains_dev',
        multipleStatements: true
});

db.connect();

app.get('/has_offers_many_days', function(req, res){

    //var today = moment().format('YYYY-MM-DD');
    //var yesterday = moment().subtract(10, 'day').format('YYYY-MM-DD');

    var days = req.query.n;

    if(!days) {
        days = 1;
    }

    for (var j = 1; j <= days ; j++) {

        var day = moment().subtract(j, 'day').format('YYYY-MM-DD');

        var url = "https://api.hasoffers.com/Apiv3/json\
?NetworkId=z6m&Target=Affiliate_Report&Method=getStats\
&api_key=321ccbdbe5133ef3df9d3bf1db18580153c0e5a70844b193cfa4e40c3194f623\
&fields%5B%5D=Stat.date&fields%5B%5D=Stat.conversions&fields%5B%5D=Stat.clicks&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.payout\
&groups%5B%5D=Stat.date&groups%5B%5D=Stat.offer_id\
&data_start="+day+"&data_end="+moment().format('YYYY-MM-DD');

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var data = JSON.parse(body).response.data.data;

                for (var i = 0; i < data.length ; i++) {

                    var date = data[i].Stat.date;
                    var clicks = data[i].Stat.clicks;
                    var conversions = data[i].Stat.conversions;
                    var offer_id = data[i].Stat.offer_id;
                    var payout = data[i].Stat.payout;

                    console.log("CALL insert_offer_report(" + offer_id + ",'" + date + "'," + clicks + "," + conversions + "," + payout + ",'test@email.com');");
                }

                //console.log(response);
                //console.log(JSON.stringify(data, null, 4));
                //res.status(200);
                //res.send(JSON.stringify(data, null, 4)); 
            }
            else {
                res.status(500);
                res.send(error); 
            }
        });
        if(j == days) {
            res.status(200);
            res.send("success");
            return;
        }
    };

});

app.get('/has_offers_two_day', function(req, res){

    //var today = moment().format('YYYY-MM-DD');
    //var yesterday = moment().subtract(10, 'day').format('YYYY-MM-DD');

    var day = moment().subtract(1, 'day').format('YYYY-MM-DD');

    var url = "https://api.hasoffers.com/Apiv3/json\
?NetworkId=z6m&Target=Affiliate_Report&Method=getStats\
&api_key=321ccbdbe5133ef3df9d3bf1db18580153c0e5a70844b193cfa4e40c3194f623\
&fields%5B%5D=Stat.date&fields%5B%5D=Stat.conversions&fields%5B%5D=Stat.clicks&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.payout\
&groups%5B%5D=Stat.date&groups%5B%5D=Stat.offer_id\
&data_start="+day+"&data_end="+moment().format('YYYY-MM-DD');

    var db_query = "";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var data = JSON.parse(body).response.data.data;

            for (var i = 0; i < data.length ; i++) {

                var date = data[i].Stat.date;
                var clicks = data[i].Stat.clicks;
                var conversions = data[i].Stat.conversions;
                var offer_id = data[i].Stat.offer_id;
                var payout = data[i].Stat.payout;

                db_query += "CALL insert_offer_report(" + offer_id + ",'" + date + "'," + clicks + "," + conversions + "," + payout + ",'test@email.com'); ";
            }

            console.log(db_query);

            db.query(db_query, function(err, docs) {
                if(err) {
                    console.log(err);
                    res.status(500);
                    res.json({error:"Error inserting reports"});
                } else {
                    res.status(200);
                    res.json({success: "Success"});
                }
            });
        }
        else {
            res.status(500);
            res.send(error); 
        }
    });

});


app.listen('5001')
console.log('Magic happens on port 5001');
exports = module.exports = app;