var express = require('express');
var router = express.Router();


// Get Homepage
router.get('/',ensureAuthenticated , (request, response)=>{
    response.render('index');
    
});

function ensureAuthenticated(request, response, next){
    if (request.isAuthenticated()) {
        return next();
    }else if(request.path === '/'){
        response.redirect('/users/login');
    }else {
        request.flash('error_msg', 'You are not logged in');
        response.redirect('/users/login');
    }
}

module.exports = router;