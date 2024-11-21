const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const User = require('../src/models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('User API', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const res = await chai.request(app).post('/api/users/register').send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('token');
        });
    });

    describe('POST /api/users/login', () => {
        it('should login an existing user', async () => {
            await User.create({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

            const res = await chai.request(app).post('/api/users/login').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
        });

        it('should not login with wrong credentials', async () => {
            const res = await chai.request(app).post('/api/users/login').send({
                email: 'wrong@example.com',
                password: 'password123',
            });

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Invalid email or password');
        });
    });
});
