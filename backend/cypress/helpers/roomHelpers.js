/// <reference types="cypress" />

// Imports
import faker, { fake } from 'faker'

// ENDPOINTS
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

// Fake Data for Room Creation
const roomNum = faker.datatype.number()
const floorNum = faker.datatype.number()
const priceNum = faker.datatype.number()

// Arrays and random entry from each array for input in creating room
const roomFeatures = ["Balcony", "Ensuite", "Sea View", "Penthouse"]
const roomCategory = ['Double', 'Single', 'Twin']
const roomFeatRng = roomFeatures[Math.floor(Math.random() * roomFeatures.length)]
const roomCateRng = roomCategory[Math.floor(Math.random() * roomCategory.length)]

// Create payload for Creating a Room with fake data
export function createFakeRoomData() {


    const payload =
    {
        "features": [roomFeatRng],
        "category": roomCateRng,
        "number": roomNum,
        "floor": floorNum,
        "available": true,
        "price": priceNum,
    }

    return payload
}

// Create paylod for edit Room data
export function editFakeRoomData() {

    let fakeRoom = createFakeRoomData()
    const editPayload =
    {
        "features": fakeRoom.features,
        "category": fakeRoom.category,
        "number": fakeRoom.number,
        "floor": fakeRoom.floor,
        "available": true,
        "price": fakeRoom.price,
        "id": Cypress.env().lastRoomID,
        "created": Cypress.env().createdRoom
    }

    return editPayload
}

// [GET] - List all Rooms with Assertion
export function getAllRoomsAssert(cy, category, features, number, newRoom) {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        // Assertion on response.body (less clutter) and check if the values are there
        const responseAsString = JSON.stringify(response.body)
        expect(responseAsString).to.have.string(features).and.string(category).and.string(number)
    });
}

// [GET] - List all Rooms
export function getAllRoomRequest(cy) {
    cy.authenticateSession().then(() => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)
        });
    })
}

// [POST] - Create new Room
export function createRoom(cy) {
    cy.authenticateSession().then(() => {
        let fakeRoom = createFakeRoomData()
        let newRoom = fakeRoom
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json',
            },
            body: fakeRoom,
        }).then((response) => {
            // Assertion on response.body (less clutter) and check if the values are there
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(fakeRoom.features).and.string(Cypress.env().lastRoomID)
            
        });
        getAllRoomsAssert(cy, fakeRoom.available, fakeRoom.category, fakeRoom.features, fakeRoom.floor, fakeRoom.number, fakeRoom.price, newRoom)
    });
}

// [PUT] - Edit Room with last ID
export function editRoom(cy) {
    cy.authenticateSession().then((response) => {
        let fakeEditRoom = editFakeRoomData()
        cy.findLastRoom().then((response) => {
            const featuresOfRoom = response.body.features
            cy.log(featuresOfRoom)
            cy.request({
                method: 'PUT',
                url: ENDPOINT_GET_ROOM + Cypress.env().lastRoomID,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: fakeEditRoom

            }).then((response) => {
                // Assertion on response.body (less clutter) and check if the values are there
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(fakeEditRoom.number).and.string(fakeEditRoom.category).and.string(Cypress.env().lastRoomID)
            })
        })
    })

}

// [DELETE] Remove Room with last ID
export function deleteRoom(cy) {
    let fakeRoom = editFakeRoomData()
    cy.findLastRoom().then(() => {
        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_ROOM + Cypress.env().lastRoomID,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            // Assertion on response.body (less clutter) and check if the values are removed
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string('true')
            expect(responseAsString).to.not.contain(fakeRoom.category).and.string(fakeRoom.floor).and.string(Cypress.env().lastRoomID)
        })
    })
}