const Register = require('../models/RegisterModel')

exports.registerHomePage = (req, res) =>{
    try {
        if(req.session.user && req.session.user.userType === 'default'){
            req.flash('errors', 'Você não pode acessar essa página enquanto estiver logado!')
            req.session.save(function(){
                return res.redirect('/')
            })
            return        
        } else {
        const userEdit = {}
        res.render('register', { userEdit })
        }
    } catch(e) {
        console.log(e)
        res.render('includes/404')
    }
}

exports.registerUser = async (req, res) => {
    try{
        if(req.session.user && req.session.user.userType === 'default'){
            req.flash('errors', 'Você não pode cadastrar outro usuário enquanto estiver logado!')
            req.session.save(function(){
                return res.redirect('/')
            })
            return        
        } else {
            const registro = new Register(req.body)
            await registro.register()
    
            if(registro.errors.length > 0){
                req.flash('errors', registro.errors)
                req.session.save(function(){
                    return res.redirect('back')
                })
                return        
            }
            req.flash('success', 'Usuário cadastrado com sucesso!')
            req.session.save(() => {
                if(req.session.user) return res.redirect('/user')
                return res.redirect('/login')
            })
        }
    } catch(e) {
        console.log(e)
        res.render('includes/404')
    }
}


//Métodos de users:

exports.userHomepage = async (req, res, next) => {
    try{
        const users = await Register.findAllUsers()
        res.render('user', { users })
        next()        
    }catch(e){
        console.log(e)
        res.render('includes/404')
    }
}

exports.editUser = async (req, res) => {
    const userEdit = await Register.findUserById(req.params.id)
    res.render('register', {userEdit})
}

exports.update = async (req, res) => {
    try{
    if(!req.params.id) return res.render('includes/404')
    const user = new Register(req.body)
    await user.updateUser(req.params.id)


    if(user.errors.length > 0){
        req.flash('errors', user.errors)
        req.session.save(function(){
            return res.redirect('back')
        })
        return        
    }
    req.flash('success', 'Usuário atualizado com sucesso!')
    req.session.save(() => {
        if(req.session.user) return res.redirect('/user')
        return res.redirect('back')
    })
    } catch(e) {
    console.log(e)
    res.render('includes/404')
    }
}

exports.deleteUser = async (req, res) => {
    try{
        await Register.deleteUser(req.params.id)
    
        req.flash('success', 'Usuário deletado com sucesso!')
        req.session.save(() => {
            if(req.session.user) return res.redirect('/user')
            return res.redirect('back')
        })
    
    }catch(e){
        console.log(e)
        res.render('includes/404')
    }
}


