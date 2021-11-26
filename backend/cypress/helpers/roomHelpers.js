/// <reference types="cypress" />

// Imports
import faker from 'faker'

// ENDPOINTS and BaseURL in Cypress.json file
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
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

    const editPayload =
    {
        "features": [roomFeatRng],
        "category": roomCateRng,
        "number": roomNum,
        "floor": floorNum,
        "available": true,
        "price": priceNum,
        "id": Cypress.env().lastRoomID,
        "created": Cypress.env().createdRoom
    }

    return editPayload
}

// [GET] - List all Rooms with Assertion
export function getAllRoomsAssert(cy, category, features, number) {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json',
        },
    }).then((response) => {
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
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(fakeRoom.features)
            
        });
        getAllRoomsAssert(cy, fakeRoom.available, fakeRoom.category, fakeRoom.features, fakeRoom.floor, fakeRoom.number, fakeRoom.price, newRoom)
    });
}

// [PUT] - Edit Room with last ID
export function editRoom(cy) {
    cy.authenticateSession().then(() => {
        let fakeEditRoom = editFakeRoomData()
        cy.findLastRoom().then(() => {
            cy.request({
                method: 'PUT',
                url: ENDPOINT_GET_ROOM + Cypress.env().lastRoomID,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: fakeEditRoom
            }).then((response) => {
                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(fakeEditRoom.number).and.have.string(fakeEditRoom.category)
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
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string('true').and.not.contain(fakeRoom.category).and.not.contain(fakeRoom.floor)
        })
    })
}