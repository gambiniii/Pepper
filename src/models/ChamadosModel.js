const mongoose = require('mongoose');

const ChamadosSchema = new mongoose.Schema({
    categoria: {type: String, required: true},
    assunto: {type: String, required: true},
    idSolicitante: {type: String, required: true},
    nomeSolicitante: {type: String, required: true},
    idResponsavel: {type: String, required: false, default: null},
    nomeResponsavel: {type: String, required: false, default: null},
    dataAbertura: {type: String, required: true},
    status: {type: String, required: true},
    atividade: {type: Array, required: true},
})

const ChamadosModel = mongoose.model('Chamados', ChamadosSchema);

class Chamados{
    constructor(body , user){
        this.body = body
        this.body.idSolicitante = user._id
        this.body.status = 'Em processamento'
        this.body.dataAbertura = this.criaData()
        this.body.nomeSolicitante = user.nome+' '+user.sobrenome
        this.chamado = null
        this.errors = []
        this.user = user
    }

    async registroChamado(){
        this.valida();
        if(this.errors.length > 0) return

        this.Andamentos(this.body, this.user)
        this.chamado = await ChamadosModel.create(this.body)
    }

    async insereAndamento(body, user){
        this.Andamentos(body, user)
        if(this.errors.length > 0) return

        const andamento = await ChamadosModel.findByIdAndUpdate(body._id, body, { new: true })
        return andamento
    }

    valida(){
        if(!this.body.categoria) this.errors.push('Nenhuma categoria de chamado foi selecionada!')

        if(this.body.assunto.length == 0) this.errors.push('O assunto não pode estar vazio!')
        else if(this.body.assunto.length <3 || this.body.assunto.length > 30 ) this.errors.push('O assunto deve conter entre 3 e 20 caracteres!')

        if(this.body.descricao.length == 0) this.errors.push('A descricao não pode estar vazia!')
        else if(this.body.descricao.length < 10 || this.body.descricao.length > 1000 ) this.errors.push('A descricao deve conter entre 10 e 1000 caracteres!')
    }

    Andamentos(body, user){
        if(this.body.descricao.length == 0) this.errors.push('A descrição não pode estar vazia!')
        else if(this.body.descricao.length < 10 || this.body.descricao.length > 1000 ) this.errors.push('A descricao deve conter entre 10 e 1000 caracteres!')

        if(this.errors.length > 0) return

        if(!body.atividade){
            body.atividade = []
            console.log('Novo campo de atividade criado...')
        }

        const andamento = {
            idAndamento: body.atividade.length + 1,
            dataPostagem: this.criaData(),
            descricao: this.body.descricao,
            idUser: user._id,
            nomeUser: user.nome+' '+user.sobrenome
        }
        return body.atividade.push(andamento)
    }

    criaData(){
        let data = new Date();
        let dataAtual = new Intl.DateTimeFormat('pt-BR').format(data)
        return dataAtual
    }


    //usado para listar os chamados para determinado usuário
    static async buscaChamados(user){
        let chamados
        if(user)chamados = await ChamadosModel.find({ idSolicitante: user._id})
        else chamados = await ChamadosModel.find()
        return chamados
    }

    //usado para localizar um tk pelo _id do chamado em questão
    async buscaPorId(id){
        if(typeof id !== 'string') return this.errors.push('ID de chamado inválido!')
        const ticket = await ChamadosModel.findById(id)
        return ticket
    }

    static async updateState(id, stat, user){
        const ticket = await ChamadosModel.findById(id)

        if(stat == '1' && user.userType === 'admin' && ticket.status === 'Em processamento'){
            ticket.status = 'Em análise'
            ticket.nomeResponsavel = user.nome + ' ' + user.sobrenome
            ticket.idResponsavel = user._id
            const chamado = await ChamadosModel.findByIdAndUpdate(id , ticket, {new: true})
            return chamado    
        
        } else if(stat == '2') {
            ticket.status = 'Em análise'
            const chamado = await ChamadosModel.findByIdAndUpdate(id , ticket, {new: true})
            return chamado   

        } else if(stat == '3' && user.userType === 'admin'){
            ticket.status = 'Resolvido'
            const chamado = await ChamadosModel.findByIdAndUpdate(id , ticket, {new: true})
            return chamado    

        } else if (stat == '4' && ticket.status === 'Resolvido'){
            ticket.status = 'Finalizado'
            const chamado = await ChamadosModel.findByIdAndUpdate(id , ticket, {new: true})
            return chamado    
        }
    }
}


module.exports = ChamadosModel
module.exports = Chamados
