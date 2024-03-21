import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { request } from 'http';
import { setHeapSnapshotNearHeapLimit } from 'v8';


const nome = faker.person.firstName();
const email = faker.internet.email();
const senha = faker.internet.password();


test('Cadastar usuário', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": email,
      "password": senha,
      "administrador": "false"
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeTruthy()
  expect (postAPIResponse.status()).toBe(201)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("message", "Cadastro realizado com sucesso")

});

test('Tentar cadastar usuário sem email', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": "",
      "password": senha,
      "administrador": "false"
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeFalsy()
  expect (postAPIResponse.status()).toBe(400)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("email", "email não pode ficar em branco")

});

test('Tentar cadastar usuário sem nome', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": "",
      "email": email,
      "password": senha,
      "administrador": "false"
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeFalsy()
  expect (postAPIResponse.status()).toBe(400)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("nome", "nome não pode ficar em branco")

});

test('Tentar cadastar usuário sem senha', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": email,
      "password": "",
      "administrador": "false"
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeFalsy()
  expect (postAPIResponse.status()).toBe(400)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("password", "password não pode ficar em branco")

});

test('Tentar cadastar usuário sem administrador', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": email,
      "password": senha,
      "administrador": ""
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeFalsy()
  expect (postAPIResponse.status()).toBe(400)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("administrador", "administrador deve ser 'true' ou 'false'")

});

test('Tentar cadastar usuário com email inválido', async ({ request }) => {
  //fazendo a requisição
  const postAPIResponse = await request.post('/usuarios',{
    data:{
      "nome": nome,
      "email": "email.com",
      "password": senha,
      "administrador": "false"
    }
  })

  //validando resposta - status code
  expect (postAPIResponse.ok()).toBeFalsy()
  expect (postAPIResponse.status()).toBe(400)

  const postAPIResponseBody = await postAPIResponse.json()
  console.log(postAPIResponseBody)

  //validando resposta - body
  expect(postAPIResponseBody).toHaveProperty("email", "email deve ser um email válido")

});