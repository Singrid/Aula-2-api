# API de Transferências

Esta API permite login, registro de usuário, consulta de usuários e transferência de valores. O objetivo é servir de base para estudos de testes e automação de APIs.

## Funcionalidades
- **Registro de usuário**: Não permite usuários duplicados.
- **Login**: Login e senha obrigatórios.
- **Consulta de usuários**: Lista todos os usuários cadastrados.
- **Transferência de valores**: Só permite transferências acima de R$ 5.000,00 para destinatários marcados como "favorecido".
- **Documentação Swagger**: Disponível em `/api-docs`.

## Estrutura
- `controller/` - Rotas e controllers
- `service/` - Regras de negócio
- `repository/` - Dados em memória
- `app.js` - Configuração da aplicação
- `server.js` - Inicialização do servidor
- `swagger.json` - Documentação da API

## Instalação
1. Instale as dependências:
   ```powershell
   npm install express swagger-ui-express
   ```
2. Para rodar o servidor:
   ```powershell
   node server.js
   ```

## Endpoints
- `POST /users/register` - Registro de usuário
- `POST /users/login` - Login
- `GET /users` - Consulta de usuários
- `POST /transfer` - Transferência de valores
- `GET /api-docs` - Documentação Swagger

## Testes
Para testar com Supertest, importe o `app.js` sem o método `listen()`.

## Observações
- O banco de dados é em memória, os dados são perdidos ao reiniciar.
- Para transferências acima de R$ 5.000,00, o destinatário deve ser favorecido (`favorecido: true`).

# Trabalho de Conclusão da Disciplina de Automação de Testes de Performance

## Conceitos a serem Empregados

### Thresholds
Esse conceito pode ser visto no arquivo `transfer.test.js` no seguinte trecho de código

thresholds: {
    // percentil 95 deve ser menor que 2000ms
    'http_req_duration': ['p(95)<2000'],
  }, 

### Checks
Esse conceito pode ser visto em alguns lugares desse teste, um deles é no arquivo `utils.js`, na verificação se um usuário foi registrado com sucesso no seguinte trecho do código

// Register a user. Checks that status is 201 (created).
export function registerUser(username, password, favorecido = false) {
  const url = `${getBaseUrl()}/users/register`;
  const payload = JSON.stringify({ username, password, favorecido });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, {
    'register status is 201': (r) => r.status === 201,
  });
  return res;
}
