const Login = require('../models/LoginModel')

exports.loginHomePage = (req, res) => {
    if(req.session.user){
        req.flash('errors', 'Você não pode acessar essa página enquanto estiver logado!')
        req.session.save(function(){
            return res.redirect('/')
        })
        return        
    } else {
        res.render('login')
    }
}

exports.loginUser = async (req, res) => {
    try{
        if(req.session.user){
            req.flash('errors', 'Você não pode acessar essa página enquanto estiver logado!')
            req.session.save(function(){
                return res.redirect('/')
            })
            return        
        } else {
        
            const login = new Login(req.body)
            await login.login()

            if(login.errors.length > 0){
                req.flash('errors', login.errors)
                req.session.save(() => {
                    return res.redirect('back')
                })
                return
            }
            req.flash('success', `Seja bem vindo(a) ${login.user.nome}!`)
            req.session.user = login.user
            req.session.save(() => {
                return res.redirect('/')
            });
        }
    } catch(e) {
        console.log(e)
        res.render('includes/404')
    }
}

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}