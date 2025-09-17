const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../app');

//Mock
const transferService = require('../../service/transferService');

//Testes sem uso de simulador
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatario inexistente recebo 400', async() => {
            const resposta = await request(app)
                .post('/transfer')
                .send({
                    from: "Pedro",
                    to: "Luiza",
                    amount: 100
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({ error: 'Usuário remetente ou destinatário não encontrado.' });
            //Ou pode ser feito assim
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistente recebo 400', async() => {
            //mocar apenas a função transfer do service
            const transferServiceMock = sinon
                .stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado.'));

            const resposta = await request(app)
                .post('/transfer')
                .send({
                    from: "Pedro",
                    to: "Luiza",
                    amount: 1000
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({ error: 'Usuário remetente ou destinatário não encontrado.' });
            //Ou pode ser feito assim
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado.');

            //reseta o Mock
            sinon.restore();
        });
    });

    describe("GET /trasnfers", () => {});
});