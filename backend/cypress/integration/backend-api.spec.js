/// <reference types="cypress" />

// Imports
import * as clientData from '../helpers/clientHelpers'
import * as roomData from '../helpers/roomHelpers'

//    [API] - Test Suite
describe('[API] - Test Suite', () => {

    //  [GET] - List All Clients
    it('[GET] - List All Clients', () => {
        clientData.getAllClientRequest(cy)
    })

    //  [POST] - Create Client
    it('[POST] - Create Client', () => {
        clientData.createClient(cy)
    })

    //  [PUT] - Edit Client
    it('[PUT] - Edit Client', () => {
        clientData.editClient(cy)
    })

    //  [DELETE] - Remove Client
    it('[DELETE] - Remove Client', () => {
        clientData.deleteClient(cy)
    })

    //  [GET] - List All Rooms
    it('[GET] - List All Rooms', () => {
        roomData.getAllRoomRequest(cy)
    });

    //  [POST] - Create Room
    it('[POST] - Create Room', () => {
        roomData.createRoom(cy)
    });
    
    //  [DELETE] - Remove Room
    it('[DELETE] - Remove Room', () => {
        roomData.deleteRoom(cy)
    });

    //  [PUT] - Edit Room
    it('[PUT] - Edit Room', () => {
        roomData.editRoom(cy)
    });

})