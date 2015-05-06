module.exports = function(app, db, checkAuth){

    var moment = require('moment');

    app.get('/reporting_for_n_days', checkAuth, function (req, res) {

        var days = req.query.n;
        var user = req.signedCookies.user_id;

        var ret_arr = [];
        var ret_obj = [];

        var day = moment().subtract(days, 'day').format('YYYY-MM-DD');

        if(days >= 0) {
            db.query("SELECT * FROM reporting WHERE day >= ? AND user= ?", [day, user], function(err, docs) {
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
            res.json({error: "Days must be greater than 0."});
        }
    });

}