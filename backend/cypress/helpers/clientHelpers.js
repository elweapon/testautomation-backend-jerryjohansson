/// <reference types="cypress" />

// Imports
import faker from 'faker'

// ENDPOINTS
const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

// Fake Data for Client Creation
const fullName = faker.name.firstName() + ' ' + faker.name.lastName()
const email = faker.internet.email()
//const phone = faker.datatype.number()
//Faker Phonenuber format wrong for input, dont show when client is saved
const phone = faker.phone.phoneNumber()

// Create payload for Creating a client with fake data
export function createFakeClientData() {


    const payload = {
        "name": fullName,
        "email": email,
        "telephone": phone
    }

    return payload
}

export function editFakeClientData() {

    const editPayload = {
        'id': Cypress.env().lastIDGlob,
        'created': Cypress.env().createdGlob,
        'name': fullName,
        'email': email,
        'telephone': phone
    }
    
    return editPayload
}

// [GET] - List all clients with Assertions
export function getAllClientsAssert(cy, name, email, telephone) {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        const responseAsString = JSON.stringify(response.body)
        expect(responseAsString).to.have.string(name).and.string(email).and.string(telephone)
    });
}

// [GET] - List all Clients
export function getAllClientRequest(cy) {
    cy.authenticateSession().then(() => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
        });
    })
}

// [POST] - Create new Client
export function createClient(cy) {
    cy.authenticateSession().then(() => {
        const fakeClient = createFakeClientData()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json',
            },
            body: fakeClient
        }).then((response) => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(fakeClient.email)
        });
        getAllClientsAssert(cy, fakeClient.name, fakeClient.email, fakeClient.telephone)
    });
}

// [PUT] - Edit Client with last ID
export function editClient(cy) {
    cy.authenticateSession().then(() => {
        cy.findLastClient().then(() => {
            const editFakeClient = editFakeClientData()
            cy.request({
                method: 'PUT',
                url: ENDPOINT_GET_CLIENT + Cypress.env().lastIDGlob,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: editFakeClient
            }).then((response) => {
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(editFakeClient.email)
            })
            getAllClientsAssert(cy, editFakeClient.name, editFakeClient.email, editFakeClient.telephone)
        })
    })

}

// [DELETE] - Remove Client with last ID
export function deleteClient(cy) {
    let fakeClient = createFakeClientData()
    cy.findLastClient().then(() => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_CLIENT + Cypress.env().lastIDGlob,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string('true')
            expect(responseAsString).to.not.have.string(fakeClient.email)
        })
    })
}