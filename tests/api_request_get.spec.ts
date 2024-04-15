import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { request } from 'http';
import { setHeapSnapshotNearHeapLimit } from 'v8';


const nome = faker.person.firstName();
const email = faker.internet.email();
const senha = faker.internet.password();


test('Buscar todos os usuários', async ({ request }) => {
  //fazendo a requisição
  const getAPIResponse = await request.get('/usuarios',)

  //validando resposta - status code
  expect (getAPIResponse.ok()).toBeTruthy()
  expect (getAPIResponse.status()).toBe(200)

  const getAPIResponseBody = await getAPIResponse.json()
  console.log(getAPIResponseBody)

  //validando resposta - body
  expect(getAPIResponseBody).toHaveProperty("quantidade")
  expect(getAPIResponseBody).toHaveProperty("usuarios")

});

test('Buscar usuário pelo id', async ({ request }) => {
  //cadastrando usuário
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": email,
      "password": senha,
      "administrador": "false"
    }
  })

  //salvando o id do usuário cadastrado anteiormente
  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)
  const id = postAPIResponseBody._id

  //fazendo a requisição
  const getAPIResponse = await request.get(`/usuarios?_id=${id}`);

  //validando resposta - status code
  expect (getAPIResponse.ok()).toBeTruthy()
  expect (getAPIResponse.status()).toBe(200)

  const getAPIResponseBody = await getAPIResponse.json()
  console.log(getAPIResponseBody)

  //validando resposta - body
  expect(getAPIResponseBody).toHaveProperty("quantidade", 1)
  expect(getAPIResponseBody.usuarios[0]).toHaveProperty("_id", `${id}`)

});

test.only('Buscar todos os usuários administradores', async ({ request }) => {
  //fazendo a requisição
  const getAPIResponse = (await request.get('/usuarios?administrador=true',))

  //salvando a quantidade de usuários administradores
  const getAPIResponseBody = await getAPIResponse.json()
  const qtdUsuariosAdm = getAPIResponseBody.quantidade

  //validando resposta - status code
  expect (getAPIResponse.ok()).toBeTruthy()
  expect (getAPIResponse.status()).toBe(200)

  //validando resposta - body
  expect(getAPIResponseBody).toHaveProperty("quantidade", qtdUsuariosAdm)
  for (let i = 0; i < qtdUsuariosAdm; i++){
    expect(getAPIResponseBody.usuarios[i]).toHaveProperty("administrador", "true")
  }
  console.log(getAPIResponseBody)
});

test('Buscar usuário inexistente', async ({ request }) => {
  //fazendo a requisição
  const getAPIResponse = (await request.get('/usuarios/ABC',))

  //validando resposta - status code
  expect (getAPIResponse.ok()).toBeFalsy()
  expect (getAPIResponse.status()).toBe(400)

  const getAPIResponseBody = await getAPIResponse.json()

  //validando resposta - body
  expect(getAPIResponseBody).toHaveProperty("message", "Usuário não encontrado")

});