const Chamado = require('../models/ChamadosModel')

exports.chamadosHomePage = (req, res, next) => {
    res.render('chamados')
    next()    
}


exports.chamadosFinalizadosHomePage = async (req, res, next) => {
    try{
        const chamados = await Chamado.buscaChamados()
        res.render('chamadosFinalizados', { chamados })
        next()        

    }catch(e){
        console.log(e)
        res.render('includes/404')
    }
}

exports.abrirChamado = async (req, res) => {
    try{
        const chamado = new Chamado(req.body, req.session.user)
        await chamado.registroChamado()

        if(chamado.errors.length > 0){
            req.flash('errors', chamado.errors)
            req.session.save(() => {
                return res.redirect('back')
            })
            return
        }
        req.flash('success', 'Seu chamado foi encaminhado para nossa equipe!')
        req.session.save(() => {
            return res.redirect('/chamadosAtivos')
        })
    } catch (e){
        console.log(e)
        res.render('includes/404')
    }
}

exports.chamadosAtivosHomePage = async (req, res, next) => {
    try{
        const chamados = await Chamado.buscaChamados(req.session.user)
        res.render('chamadosAtivos', { chamados })
        next()
    }catch(e){
        console.log(e)
        res.render('includes/404')
    }
}

exports.chamadosADMHomePage = async (req, res, next) => {
    try{
        const chamados = await Chamado.buscaChamados()
        res.render('chamadosADM', { chamados })
        next()
    }catch(e){
        console.log(e) 
        res.render('includes/404')
    }
}


exports.visualizarChamado = async (req, res) => {
    try{
        const chamado = new Chamado(req.body, req.session.user)
        const ticket = await chamado.buscaPorId(req.params.id)
    
        res.render('ticket', { ticket })
    }catch(e){
        console.log(e)
        res.render('includes/404')
    }
    
}

exports.inserirAndamento = async (req, res, next) => {
    try{
        const chamado = new Chamado(req.body, req.session.user)
        const atividade = await chamado.buscaPorId(req.params.id)
    
        await chamado.insereAndamento(atividade, req.session.user) 

        if(chamado.errors.length > 0){
            req.flash('errors', chamado.errors)
            req.session.save(() => {
                return res.redirect('back')
            })
            return
        }
        req.flash('success', 'Seu andamento foi inserido com sucesso!')
        req.session.save(() => {
            return res.redirect(`back`)
        })
    } catch (e){
        console.log(e)
        res.render('includes/404')
    }
}

exports.updateStatus = async (req, res) => {
    try{
        const chamado = await Chamado.updateState(req.params.id, req.params.status, req.session.user)

        req.flash('success', `Situação de chamado alterada: ${chamado.status}`)
        req.session.save(() => {
            return res.redirect(`back`)
        });
    } catch (e){
        console.log(e)
        res.render('includes/404')
    }
}
