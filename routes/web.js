const homeController=require('../app/http/controllers/homeController');
const authController= require('../app/http/controllers/authController');
const orderController = require('../app/http/controllers/customers/orderController');
const cartController = require('../app/http/controllers/customers/cartController');
const AdminOrderController = require('../app/http/controllers/admin/orderController')

//admin middleware
const auth = require("../app/http/middleware/auth")
const guest = require('../app/http/middleware/guest')
const admin = require("../app/http/middleware/admin")

function  initRoutes(app)
{
    app.get('/',homeController().index)
    app.get("/login",guest,authController().login)
    app.post('/login',authController().postLogin)

    app.get("/register",guest,authController().register);
    app.post("/register",authController().postRegister);

    app.post("/logout",authController().logout);

   
    app.get("/cart",cartController().index);
    app.post("/update-cart",cartController().update)

    //customer routes
    app.post('/orders',auth,orderController().store)
    app.get('/customers/orders',auth,orderController().index)

    //Admin routes
    app.get('/admin/orders',admin,AdminOrderController().index)
    
}


module.exports = initRoutes