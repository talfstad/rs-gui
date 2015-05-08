module.exports = function(app, db, checkAuth){

    var moment = require('moment');

    app.get('/daily_stats', checkAuth, function (req, res) {

        var user = req.signedCookies.user_id;

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT daily_stats.*,get_country_distribution(url) AS country_dist FROM daily_stats ORDER BY url;';
        }
        else {
            db_query = 'SELECT daily_stats.*,get_country_distribution(url) AS country_dist FROM daily_stats WHERE user = \'' + user + '\' ORDER BY url;';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error: "Internal server error looking up the daily stats."});
            } else {
                res.status(200);
                res.json({rows:docs});
            }
        });

    });

    app.get('/ripped_hits_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;

        var ret_arr = [];
        var ret_obj = [];

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT hits_list FROM daily_stats_archive WHERE registered = 0;';
        }
        else {
            db_query = 'SELECT hits_list FROM daily_stats_archive WHERE user = \'' + user + '\' AND registered = 0;';
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

    app.get('/jacks_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;

        var ret_arr = [];
        var ret_obj = [];

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT jacks_list FROM daily_stats_archive WHERE registered = 0;';
        }
        else {
            db_query = 'SELECT jacks_list FROM daily_stats_archive WHERE user = \'' + user + '\' AND registered = 0;';
        }

        if(days > 0) {
            db.query(db_query, function(err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({error: "Internal server error looking up the jacks list from archive stats."});
                } else {       

                    for (var i = 0; i < docs.length; i++) {
                        var jacks_list = docs[i].jacks_list;
                        var jacks_arr = jacks_list.split(',');
                        jacks_arr = jacks_arr.reverse();
                        for (var j = 0; j < days; j++) {
                            if(!ret_arr[j]) {
                                ret_arr[j] = 0;
                            }
                            if(jacks_arr[j]) {
                                ret_arr[j] += Number(jacks_arr[j]);
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

    app.get('/rips_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;

        var ret_obj = [];
        var ret_arr = [];

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        if(days > 0) {
            db.query('SELECT get_rips_for_n_days(?, ?) AS rips_list;', [days, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({error: "Internal server error looking up the rips for " + days + " days."});
                } else {       
                    if(docs[0]) {
                        var rips_list = docs[0].rips_list;
                        var rips_arr = rips_list.split(',');
                        for (var i = 0; i < rips_arr.length; i++) {
                            //this function also returns todays rips
                            var d = moment().subtract(i, 'days').format('YYYY-MM-DD');
                            ret_obj[i] = {day:d, rips:rips_arr[i]};
                        };
                        res.status(200);
                        ret_obj.shift(); //remove todays stats
                        res.json(ret_obj);
                    }
                    else {
                        res.status(500);
                        res.json({error: "Internal server error looking up the rips for " + days + " days."});
                    }
                }
            });
        } else {
            res.status(400);
            res.json({error: "Days must be greater than 0."});
        }
    });

    app.get('/url_report_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var id = req.query.id;
        var user = req.signedCookies.user_id;

        var daily_jacks_list;
        var daily_hits_list;
        var daily_hits_ret_arr = [];
        var daily_jacks_ret_arr = [];
        var daily_ret_obj = [];

        var hourly_jacks_list;
        var hourly_hits_list;
        var hourly_ret_obj = [];

        var db_query = '';
        if(req.signedCookies.admin == 'true') {
           user = 'admin';
        }

        if(days > 0) {
            db.query('CALL get_report_data(?, ?);', [id, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({error: "Internal server error looking up the report data for id = " + id +"."});
                } else {
                    if(docs[0][0]) {
                        daily_hits_list = docs[0][0].hits_list;
                        daily_jacks_list = docs[0][0].jacks_list;

                        var daily_hits_arr = daily_hits_list.split(',');
                        daily_hits_arr = daily_hits_arr.reverse();
                        
                        var daily_jacks_arr = daily_jacks_list.split(',');
                        daily_jacks_arr = daily_jacks_arr.reverse();

                        for (var j = 0; j < days; j++) {
                            if(!daily_jacks_ret_arr[j]) {
                                daily_jacks_ret_arr[j] = 0;
                            }
                            if(daily_jacks_arr[j]) {
                                daily_jacks_ret_arr[j] += Number(daily_jacks_arr[j]);
                            }

                            if(!daily_hits_ret_arr[j]) {
                                daily_hits_ret_arr[j] = 0;
                            }
                            if(daily_hits_arr[j]) {
                                daily_hits_ret_arr[j] += Number(daily_hits_arr[j]);
                            }
                        };
                        
                        for (var i = 0; i < days; i++) {
                            var d = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
                            daily_ret_obj[i] = {day:d, hits:daily_hits_ret_arr[i], jacks:daily_jacks_ret_arr[i]};
                        };

                        db.query('CALL get_hourly_stats(?, ?);', [id, user], function(err2, docs2) {
                            if (err2) {
                                console.log(err2);
                                res.status(500);
                                res.json({error: "Internal server error looking up the hourly stats for id = " + id +"."});
                            } else {       

                                if(docs2[0][0]) {

                                    var hourly_hits_list = docs2[0][0].hits_list;
                                    if(docs2[0][0].hits) {
                                        //add current hour hits
                                        hourly_hits_list = hourly_hits_list + ',' + docs2[0][0].hits;
                                    }

                                    var hourly_jacks_list = docs2[0][0].jacks_list;
                                    if(docs2[0][0].jacks) {
                                        //add current hour jacks
                                        hourly_jacks_list = hourly_jacks_list + ',' + docs2[0][0].jacks; 
                                    }

                                    if(hourly_hits_list.charAt(0) == ',') {
                                        hourly_hits_list = hourly_hits_list.substring(1, hourly_hits_list.length); //remove preceding ',' if it's there
                                    }
                                    if(hourly_jacks_list.charAt(0) == ',') {
                                        hourly_jacks_list = hourly_jacks_list.substring(1, hourly_jacks_list.length); //remove preceding ',' if it's there
                                    }

                                    hourly_hits_list = fillZeroHours(hourly_hits_list);
                                    hourly_jacks_list = fillZeroHours(hourly_jacks_list);

                                    var hourly_hits_arr = hourly_hits_list.split(',');
                                    var hourly_jacks_arr = hourly_jacks_list.split(',');

                                    var curr_hour = moment().hour();
                                    for (var i = 0; i <= curr_hour; i++) {
                                        var day_hour = moment().local().hour(i).startOf('hour');
                                        hourly_ret_obj[i] = {hour:day_hour, hits:Number(hourly_hits_arr[i]), jacks:Number(hourly_jacks_arr[i])}; 
                                    };

                                    res.status(200);
                                    res.json({daily_stats:daily_ret_obj, hourly_stats:hourly_ret_obj});
                                }
                                else {
                                    res.status(500);
                                    res.json({error: "Internal server error looking up the hourly stats for id = " + id +"."});
                                }
                            }
                        });

                    }
                    else {
                        res.status(500);
                        res.json({error: "Internal server error looking up the report data for id = " + id +"."});
                    }
                }
            });
        } else {
            res.status(400);
            res.json({error: "Days must be greater than 0."});
        }
    });

    //prepends 0's to the hourly stats hits list for 
    function fillZeroHours(hits_list) {
        var curr_hour = moment().hour();

        if(hits_list.charAt(0) == ',') {
            hits_list = hits_list.substring(1, hits_list.length); //remove preceding ',' if it's there
        }

        var hits_arr = hits_list.split(',');
        var zeros_needed = curr_hour - hits_arr.length + 1;

        for (var i = 0; i < zeros_needed; i++) {
            hits_list = '0,' + hits_list;
        };

        return hits_list;
    }

    app.get('/ripped', checkAuth, function (req, res) {

        var user = req.signedCookies.user_id;

        var db_query = '';

        if(req.signedCookies.admin == 'true') {
            db_query = 'CALL get_ripped_data();';
        }
        else {
            db_query = 'CALL get_ripped_data_by_user( \'' + user +'\');';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(200);
                res.json({error:"Internal server error looking up the ripped stats."});
            } else {          
                if(docs[0]) {
                    res.status(200);
                    res.json(docs[0]);
                }
                else {
                    res.status(200);
                    res.json({error:"Internal server error looking up the ripped stats."});
                }
            }
        });
    });

    app.get('/new_ripped', checkAuth, function (req, res) {

        var user = req.signedCookies.user_id;

        var db_query = '';

        if(req.signedCookies.admin == 'true') {
            db_query = 'CALL get_new_ripped_data();';
        }
        else {
            db_query = 'CALL get_new_ripped_data_by_user( \'' + user +'\');';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error:"Internal server error looking up the new ripped stats."});
            } else {          
                if(docs[0]) {
                    res.status(200);
                    res.json(docs[0]);
                }
                else {
                    res.status(500);
                    res.json({error:"Internal server error looking up the new ripped stats."});
                }
            }
        });
    });

    app.get('/stats_overview', checkAuth, function (req, res) {
        
        var user = req.signedCookies.user_id;
        var db_query = '';

        if(req.signedCookies.admin == 'true') {
            db_query = 'CALL get_stats_overview();';
        }
        else {
            db_query = 'CALL get_stats_overview_by_user(\''+user+'\');';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error:"Internal server error looking up the stat overview."});
            } else {          
                if(docs[0][0]) {
                    res.status(200);
                    res.json(docs[0][0]);
                }
                else {
                    res.status(500);
                    res.json({error:"Internal server error looking up the stat overview."});
                }
            }
        });
    });

}