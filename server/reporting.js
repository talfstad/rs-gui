module.exports = function(app, db, checkAuth){

    var moment = require('moment');
    var config = require('./config');
    var request = require('request');

    app.get('/reporting_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;                              

        var ret_arr = [];
        var ret_obj = [];

        var day = moment().subtract(days, 'day').format('YYYY-MM-DD');
                        
        if(req.signedCookies.admin == 'true') {
            db_query = "SELECT * FROM reporting WHERE day >= '" + day + "';"; 
        }
        else {
            db_query = "SELECT * FROM reporting WHERE day >= '" + day + "' AND user = '" + user + "';";
        } 

        update_reporting(req, function(error) {

        if(days >= 0) {
            db.query("SELECT * FROM reporting WHERE day >= ? AND user= ?", [day, user], function(err, docs) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send({error : "Error updating reports."});
                return;
            }

            if(days >= 0) {
                db.query("SELECT * FROM reporting WHERE day >= ?;", [day], function(err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.json({error: "Internal server error looking up the the reporting stats."});
                    } else {       
                        if(!docs[0]) {
                            console.log(err);
                        res.status(200);
                            res.json({error: "Internal server error looking up the the reporting stats."});
                        } else {
                            res.status(200);
                            res.json(docs);
                        }
                    }
                });
            } else {
                res.status(400);
                res.json({error: "Days must be greater than or equal to 0."});
            }
        });
    });

    function update_reporting(req, callback){

        var user = req.signedCookies.user_id;
        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        var api_key = config.api_key_map[user];

        var day = moment().subtract(1, 'day').format('YYYY-MM-DD');

        var url = "https://api.hasoffers.com/Apiv3/json\
?NetworkId=z6m&Target=Affiliate_Report&Method=getStats\
&api_key="+api_key+"\
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

                    db_query += "CALL insert_offer_report(" + offer_id + ",'" + date + "'," + clicks + "," + conversions + "," + payout + ",'"+ user +"');";
                }

                db.query(db_query, function(err, docs) {
                    if(err) {
                        console.log(err);
                        error = err;
                        callback(error);
                        
                    } else {
                        callback(error);
                    }
                });
            }
            else {
                callback(error);
            }
        });
    }

}