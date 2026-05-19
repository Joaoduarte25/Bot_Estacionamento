class Messages {
    messages = {
        '0': '❌ Opção inválida. Digite "menu" para ver as opções novamente.',
        '1': `🕒 Nosso horário de atendimento é:
                Seg-Sex: 07h às 20h\n\nDigite "menu" para retornar ao início`,
        '2': '📞 Um atendente será chamado. Por favor, aguarde...\n\nDigite "menu" para retornar ao início',
        '3': `💼 Nossos serviços:
            - Mensalista 
            - Diaria
            - Estacionamento para Carros e Motos\n\nDigite "menu" para retornar ao início`,
        '4': `📍 Nossa localização:
                Mendes Estacionamento - R. Carambola Natal, 27 - Vila Natal, São Paulo - SP, 04863-160\n\nDigite "menu" para retornar ao início`,
        '5': `💳 Aceitamos pagamentos via:
            - Pix
            - Cartão de Crédito/Débito
            - Dinheiro\n\nDigite "menu" para retornar ao início`,
        '6': `💰 Nossos valores:
            - Mensalista: R$ 170/mês(Carro) e R$ 130/mês(moto)
            - Carro Pequeno: R$ 20,00/dia
            - Carro Grande: R$ 25,00/dia
            - Moto: R$ 15,00/dia
            - Van e Caminhão valores sob consulta\n\nDigite "menu" para retornar ao início`,
        '7': 'Atendimento automático foi reativado para este número',
        '8': 'Atendimento automático foi encerrado para este número',
        '10': `Olá! Seja bem-vindo ao atendimento automático do estacionamento Mendes. Por favor, escolha uma das opções abaixo:\n

1️⃣ - Ver horário de atendimento 🕒
2️⃣ - Falar com atendente 👋
3️⃣ - Ver nossos serviços 🛑
4️⃣ - Ver localização 📍
5️⃣ - Formas de pagamento 💳
6️⃣ - Ver Valores 💲
7️⃣ - Reativar atendimento automático 🤖
8️⃣ - Encerrar atendimento \n
        
Digite a opção desejada:`
    }

    getMessage(index = 0) {
        return this.messages[index.toString()] ?? this.messages['0'];
    }
}

module.exports = new Messages();
