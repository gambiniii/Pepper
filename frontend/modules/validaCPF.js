class criaCPF{
    constructor(cpfEnviado){
        this.cpfEnviado = cpfEnviado 
    }
    get cpfLimpo(){
        return this.cpfEnviado.replace(/\D+/g, '')
    }
    validaCPF(){
        if(this.cpfLimpo === 'undefined') return false
        if(this.cpfLimpo.length !== 11) return false
        if(this.isSequencia()) return false

        let cpfParcial = this.cpfLimpo.slice(0, -2)
        let digito1 = this.calculoCPF(cpfParcial)
        let digito2 = this.calculoCPF(cpfParcial + digito1)

        let CPFValidado = cpfParcial + digito1 + digito2

        if(CPFValidado !== this.cpfLimpo) return false
        return true
    }
    calculoCPF(cpfParcial){
        const cpfArray = Array.from(cpfParcial)
        let redutor = cpfArray.length+1
        const validaCPF = cpfArray.reduce(function(acumulador, valor){
            acumulador += (Number(valor) * redutor)
            redutor--
            return acumulador;
        },0)
        const digito = 11 - (validaCPF%11)
        return digito > 9 ? '0': String(digito)
    }
    isSequencia(){
        return this.cpfLimpo[0].repeat(this.cpfLimpo.length) === this.cpfLimpo
    }



}

const cpf1 = new criaCPF()

module.exports.criaCPF = criaCPF



