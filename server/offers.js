module.exports = function(app, db, checkAuth){

/*
    /userList: 
        Returns a list of users to be used when an offer
        is being created.
*/
    app.get("/userlist", checkAuth, function(req, res){
        if(req.signedCookies.admin == 'true'){
          db_query = 'SELECT id, user, username FROM users WHERE approved="1";';
          db.query(db_query, function(err, docs) {
            if (err) {
              console.log(err);
              res.status(500);
              res.json({error:"Internal server error looking up the offers list."});
            } else {          
              if(docs) {
                res.status(200);
                res.json(docs);
              } else {
                res.status(500);
                res.json({error:"Internal server error looking up the offers list."});
              }
            }
          });
        } else {
            res.status(200);
            res.json({error: 'You cannot haz our dataz becuze you are notz special'});
            return;
        }
    });

    app.put("/update_ripped_url/:id", checkAuth, function(req, res) {
        var id = req.body.id;
        var user = req.signedCookies.user_id;
        var replacement_links = req.body.replacement_links;
        var redirect_rate = req.body.redirect_rate;

        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        if(!replacement_links) {
            var err = "No replacement link given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!redirect_rate) {
            var err = "No redirect rate given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        db.query('CALL update_ripped_url(?,?,?,?);', [id, user, replacement_links, redirect_rate], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error updating ripped url info."});
            }
        });

        res.status(200);
        res.json({success:"Success"});
    });

    app.put("/update_ripped_url_by_offer_id/:ripped_id", checkAuth, function(req, res) {
        var ripped_id = req.body.id;
        var user = req.signedCookies.user_id;
        var offer_id = req.body.offer_id;
        var redirect_rate = req.body.redirect_rate;

        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        if(!offer_id) {
            var err = "No offer id given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!ripped_id) {
            var err = "No ripped url id given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!redirect_rate) {
            var err = "No redirect rate given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        db.query('CALL update_ripped_url_by_offer_id(?,?,?,?);', [offer_id, redirect_rate, ripped_id, user], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error updating ripped url info."});
            }
        });

        res.status(200);
        res.json({success:"Success"});
    });

    app.get('/get_offers', checkAuth, function (req, res) {
        
        var user = req.signedCookies.user_id;
        var db_query = '';

        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT offers.*, users.username from offers INNER JOIN users ON offers.user = users.user;';
        }
        else {
            db_query = 'SELECT offers.*, users.username from offers INNER JOIN users ON offers.user = users.user WHERE offers.user = \''+user+'\';';
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error:"Internal server error looking up the offers list."});
            } else {          
                if(docs) {
                    res.status(200);
                    res.json(docs);
                }
                else {
                    res.status(500);
                    res.json({error:"Internal server error looking up the offers list."});
                }
            }
        });
    });

    app.post("/update_offer", checkAuth, function(req, res) {
        var user = req.body.user_id; //this is the offer owner
        var offer_link = req.body.offer_link;
        var name = req.body.name;
        var website = req.body.website;
        var login = req.body.login;
        var external_id = req.body.external_id;

        if(!offer_link) {
            var err = "No offer link given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!name) {
            var err = "No offer name given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!external_id) {
            var err = "No offer external id given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!website) {
            website = '';
        }

        if(!login) {
            login = '';
        }

        if(!user) {
            user = req.signedCookies.user_id;
        }

        var id = null;
        db.query('INSERT INTO offers (name, offer_link, user, website, login, external_id) VALUES (?,?,?,?,?,?);', [name, offer_link, user, website, login, external_id], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(200);
                res.json({error:"Error adding new offer."});
            } else {
                db.query('SELECT username FROM users WHERE user = \''+user+'\';', function(err, usernameDocs){
                    if(err){
                        console.log(err);
                        res.status(200);
                        res.json({error: "Error adding new offer!"});
                    } else {
                        res.status(200);
                        res.json({
                            id: docs.insertId, 
                            username: usernameDocs[0].username
                        });
                    }
                });
            }
        });
    });

    app.delete("/update_offer/:id", checkAuth, function(req, res) {
        var id = req.param("id");
        var user = req.signedCookies.user_id;

        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        db.query('CALL delete_offer(?,?);', [id, user], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error deleting offer with id " + id});
            }
        });

        res.status(200);
        res.json({success:"Success"});
    });

    app.put("/update_offer/:offer_id", checkAuth, function(req, res) {
        var user = req.signedCookies.user_id;
        var offer_id = req.param("offer_id");
        var offer_link = req.body.offer_link;
        var name = req.body.name;
        var website = req.body.website;
        var login = req.body.login;

        if(req.signedCookies.admin == 'true') {
            user = 'admin';
        }

        if(!offer_id) {
            var err = "No offer id given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!offer_link) {
            var err = "No offer link given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!name) {
            var err = "No offer name given.";
            console.log(err);
            res.status(400);
            res.json({error:err});
            return;
        }

        if(!website) {
            website = '';
        }

        if(!login) {
            login = '';
        }

        db.query('CALL update_offer(?,?,?,?,?,?);', [offer_id, user, offer_link, name, website, login], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error updating offer with id " + id});
            }
        });

        res.status(200);
        res.json({success:"Success"});
    });

}