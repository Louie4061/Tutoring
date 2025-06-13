const request = require('supertest');
const app = require('../index'); // Import Express app from index.j

async function getAllStudents() { // this might not be that helpful at this point in development
    const response = await request(app)
        .get('/students')
        .expect('Content-Type', /json/);

    return {
        status: response.status,
        data: response.body
    };
}

module.exports = {
    getAllStudents
};