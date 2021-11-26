// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })




//Authentication and global variable for token
Cypress.Commands.add('authenticateSession', () => {
    const userCredentials = {
        username: 'tester01',
        password: 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c',
    }
    cy.request({
        method: 'POST',
        url: 'api/login',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredentials),
    }).then((response => {
        expect(response.status).to.eq(200)
        Cypress.env({ loginToken: response.body })
    }))
})

//Get Last Client ID and Created Date
Cypress.Commands.add('findLastClient', () => {
    cy.request({
        method: 'GET',
        url: 'api/clients',
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        const lastID = response.body[response.body.length - 1].id
        const createdDate = response.body[response.body.length - 1].created
        Cypress.env({ lastIDGlob: lastID, createdGlob: createdDate })
    })
})

//Get Last Room ID and Create Date
Cypress.Commands.add('findLastRoom', () => {
    cy.request({
        method: 'GET',
        url: 'api/rooms',
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        const lastID = response.body[response.body.length - 1].id
        const createdDate = response.body[response.body.length - 1].created
        Cypress.env({ lastRoomID: lastID, createdRoom: createdDate })
    })
})
