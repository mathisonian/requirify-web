
/*!
 * Module dependencies.
 */
var requirify = require('requirify');
var request = require('request');


exports.index = function (req, res) {

    var moduleName = req.params.modulename;
    var varName = req.params.varname;

    requirify(varName, moduleName, function(err, requrifyModuleName) {
        if(err) {
            return console.log(err);
        }

        var newurl = 'http://wzrd.in/standalone/' + requrifyModuleName + '@latest';
        request(newurl).pipe(res);

    });
};
