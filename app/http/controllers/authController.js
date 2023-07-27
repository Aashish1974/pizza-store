function authController(){
    //factory function patterns
     return {
        login(req,res) {
            return res.render('auth/login');
        },
        
        register(req,res){
            return res.render('auth/register')
        }
    }
}
module.exports = authController;