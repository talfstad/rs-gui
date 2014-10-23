
/*
 * GET home page.
 */

exports.test = function(req, res){
  	console.log("req: %s", req.params.id);
        res.send('id: ' + req.params.id);
};
