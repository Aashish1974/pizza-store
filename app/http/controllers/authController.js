const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require("passport")
function authController(){
    //factory function patterns
    const _getRedirectUrl = (req) =>
    {
        return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders'
    }

     return {
        login(req,res) {
            return res.render('auth/login');
        },
        postLogin(req,res,next)
        {
           const {name, email, password } = req.body
           if(!email || !password)
           {
             req.flush("error",'All fields are required')
             return res.redirect('/login')
           }
           passport.authenticate('local',(err,user,info)=>{
              if(err){
                req.flash('error', info.message)
                return next(err);
              }

              if(!user){
                req.flash('error',info.message)
                return res.redirect('/login');
              }

              req.logIn(user,(err)=>{
                if(err){
                 req.flash('error',info.message)
                 return next(err)
                }

                return res.redirect(_getRedirectUrl(req))
              })
           })(req,res,next)
        },
        register(req,res){
            return res.render('auth/register')
        },
        async postRegister(req, res) {
           const {name, email, password } = req.body
           //     Validate request
            if(!name|| !email || !password)
            {
                req.flash('error',"All fields are required")
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }

            //chk if email exists
            const findUser = await User.findOne({email})
            if(findUser){
                req.flash("error", "Already Registred..!!")
                req.flash('name',name)
                 return res.redirect("/register")
            }
             //hash password
              const hashedPassword = await bcrypt.hash(password,10)
            // create a user
            const user = new User({
                name: name,
                email:email,
                password: hashedPassword
            })

            user.save().then((user)=>{

                //Login
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error',"Something went wrong")
                return res.redirect('/register')
            })
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}
module.exports = authController;