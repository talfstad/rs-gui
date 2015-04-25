module.exports = function(app, db, checkAuth){

    var moment = require('moment');

    app.get('/lander_info', checkAuth, function (req, res) {

        var user = req.signedCookies.user_id;
        var db_query = '';

        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT * FROM lander_info WHERE url IS NOT NULL ORDER BY url;';
        }
        else {
            db_query = 'SELECT * FROM lander_info WHERE url IS NOT NULL AND user = \'' + user +'\' ORDER BY url;';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error:"Internal server error looking up the registered lander stats."});
            } else {          
                res.status(200);
                res.json(docs);
            }
        });
    });

    app.get('/registered_hits_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;

        var ret_arr = [];
        var ret_obj = [];

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT hits_list FROM daily_stats_archive WHERE registered = 1;';
        }
        else {
            db_query = 'SELECT hits_list FROM daily_stats_archive WHERE user = \'' + user + '\' AND registered = 1;';
        }

        if(days > 0) {
            db.query(db_query, function(err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({error: "Internal server error looking up the hits list from archive stats."});
                } else {       

                    for (var i = 0; i < docs.length; i++) {
                        var hits_list = docs[i].hits_list;
                        var hits_arr = hits_list.split(',');
                        hits_arr = hits_arr.reverse();
                        for (var j = 0; j < days; j++) {
                            if(!ret_arr[j]) {
                                ret_arr[j] = 0;
                            }
                            if(hits_arr[j]) {
                                ret_arr[j] += Number(hits_arr[j]);
                            }
                        };
                    };
                    for (var i = 0; i < ret_arr.length; i++) {
                        var d = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
                        ret_obj[i] = {day:d, hits:ret_arr[i]};
                    };
                    res.status(200);
                    res.json(ret_obj);
                }
            });
        } else {
            res.status(400);
            res.json({error: "Days must be greater than 0."});
        }
    });

}