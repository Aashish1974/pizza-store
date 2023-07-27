function cartController(){
    //factory function patterns
     return {
        index(req,res) {
            res.render('customers/cart');
        }
    }
}
module.exports = cartController;