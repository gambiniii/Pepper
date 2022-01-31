
exports.paginaInicial = async (req, res, next) => {
    res.render('index')
    next()    
}
