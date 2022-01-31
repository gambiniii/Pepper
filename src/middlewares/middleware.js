exports.middlewareGlobal = (req, res, next) => {
    res.locals.user = req.session.user
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    next()
}

exports.checkCsrfError = (err, req, res, next) => {
    if(err) {
        return res.render('includes/404')
    }
}

exports.csrfMiddleware = (req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next()
}

exports.loginRequired = (req, res, next) => {
    if(!req.session.user){
        req.flash('errors', 'Você precisa fazer login!')
        req.session.save(() => res.redirect('/'))//SALVA A SESSAO E EM SEGUIDA REDIRECIONA (CALLBACK)
        return
    }
    next()
}

exports.adminRequired = (req, res, next) => {
    if(req.session.user){
        if(req.session.user.userType === 'default'){
            req.flash('errors', 'Página não encontrada')
            req.session.save(() => res.redirect('/'))
            return
        }
    } else if (!req.session.user) {
        req.flash('errors', 'Página não encontrada')
        req.session.save(() => res.redirect('/'))
        return
    }
    
    next()
}

