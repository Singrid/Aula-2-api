const request = require('supertest');
const { expect } = require('chai');

//Testes
describe('Transfer', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatario inexistente recebo 400', async() => {
            const resposta = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: "Pedro",
                    to: "Luiza",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({ error: 'Usuário remetente ou destinatário não encontrado.' });
            //expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');
        });
    });
});