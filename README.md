# Trabalho de Conclusão da Disciplina de Automação de Testes de Performance

## Conceitos a serem Empregados

### Thresholds
Esse conceito pode ser visto no arquivo `test/k6/transfer.test.js` no seguinte trecho de código

thresholds: {  
    // percentil 95 deve ser menor que 2000ms  
    'http_req_duration': ['p(95)<2000'],  
  },   

### Checks
Esse conceito pode ser visto em alguns lugares desse teste, um deles é no arquivo `test/k6/helpers/utils.js`, na verificação se um usuário foi registrado com sucesso no seguinte trecho do código

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

### Helpers e Groups
Esses conceitos podem ser vistos no arquivo `test/k6/transfer.test.js` no trecho de código abaixo onde demonstra o uso do conceito de Groups e dentro dele faço uso de um Helper, uma função de login, que foi importada de um outro script javascript.  

 group('login and transfer', function () {  
    const loginRes = loginUser(usernameFrom, password);  

### Trends
Esse conceito é apresentado no arquivo `test/k6/transfer.test.js`, no trecho de código a seguir. Ele vai coletar tempos de execução específicos (Nesse caso o tempo da requisição de transferência).

if (res && res.timings && typeof res.timings.duration === 'number') {  
  transferTrend.add(res.timings.duration);  
}  

### Faker
Nesse conceito podemos vê-lo no arquivo  `test/k6/helpers/utils.js` na função de criar um nome aleatório

// Generate a random username for user registration  
export function randomName() {  
  const id = Math.random().toString(36).substring(2, 10);  
  return faker.person.firstName() + id;  
}  

### Variável de Ambiente
Esse conceito pode ser visto no arquivo `test/k6/helpers/getBaseUrl.js`; nele podemos garantir que se existir uma variável de ambiente chamada BASE_URL, use ela.
Se não existir, use http://localhost:3000 como padrão.

// Helper to obtain base URL from environment variable BASE_URL  
export function getBaseUrl() {  
  // k6 exposes environment variables through the global __ENV  
  return __ENV.BASE_URL || 'http://localhost:3000';  
}  

### Stages
Já esse conceito pode ser visto no seguinte arquivo `test/k6/transfer.test.js`. Aqui pode ser visto como o número de usuários virtuais (VUs) muda ao longo do tempo.

export let options = {  
  thresholds: {  
    // percentil 95 deve ser menor que 2000ms  
    'http_req_duration': ['p(95)<2000'],  
  },  
  stages: [  
    { duration: '3s', target: 10 }, // ramp up to 10 users  
    { duration: '15s', target: 10 },  // stay at 10 users  
    { duration: '2s', target: 100 },   // Spike to 100 users  
    {duration: '5s', target: 0 }   // ramp down to 0 users  
  ],  
};  

### Reaproveitamento de Resposta
Nesse conceito podemos vê-lo no seguinte arquivo `test/k6/transfer.test.js`, onde no trecho a seguir do código o nome de usuário userNameFron deixa de ser aleatório e passar a um nome real que será usado no login e na transferência

const res1 = registerUser(usernameFrom, password, false);
    // Try to extract username from response if available (data.username)  
    try {  
      const body1 = res1.json ? res1.json() : {};  
      if (body1 && body1.data && body1.data.username) {  
        usernameFrom = body1.data.username;  
      }  
    } catch (e) {  
      // ignore parse errors  
    }  

### Uso de Token de Autenticação
Pra essa API específica não se faz necessário o uso de token, mas foi colocado um trecho exemplificando como seria o uso caso fosse necessário e pode ser visto no trecho de código abaixo e encontrado no arqeuivo `test/k6/transfer.test.js`:

group('login and transfer', function () {  
   
try {  
      const loginBody = loginRes.json ? loginRes.json() : {};  
      // Try common token fields  
      const token = loginBody && (loginBody.token || loginBody.accessToken || (loginBody.data && (loginBody.data.token || loginBody.data.accessToken)));  
      if (token) {  
        headers['Authorization'] = `Bearer ${token}`;  
      }  
    } catch (e) {  
      // ignore  
    }  

### Data-Driven Testing
Criei um arquivo `test/k6/data/users.json` para simular o uso de um arquivo externo e o uso desse conceito. O arquivo contém um json com varios usuarios ja prontos da seguinte maneira:

{  
  "users": [  
    {  
      "from": "alice_test",  
      "to": "bob_test",  
      "password": "Pass@1234",  
      "amount": 100  
    },  
}  

Realizando o import e usando dentro do default function ele ficaria mais ou menos assim:

const index = (__VU - 1) % users.length;  
const userData = users[index];  

Ele poderia ser usado em vários trechos dos códigos como a seguir:
#### Cadastro usando dados do JSON
group('register two users', function () {  
  registerUser(userData.from, userData.password, false);  
  registerUser(userData.to, userData.password, true);  
});  


