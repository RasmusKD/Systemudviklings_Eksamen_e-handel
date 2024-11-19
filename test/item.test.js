process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Importér appen
const Item = require('../src/models/Item'); // Importér Item-modellen
const { expect } = chai;

chai.use(chaiHttp);

describe('Item API', () => {
    // Tøm databasen før hver test
    beforeEach(async () => {
        await Item.deleteMany({});
    });

    describe('GET /api/items', () => {
        it('should return all items', async () => {
            // Seed database
            const item = await Item.create({
                title: 'Test Item',
                description: 'This is a test item',
                price: 100,
                category: 'Electronics',
            });

            const res = await chai.request(app).get('/api/items');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.include({ title: 'Test Item' });
        });
    });

    describe('POST /api/items', () => {
        it('should create a new item', async () => {
            const newItem = {
                title: 'New Item',
                description: 'This is a new item',
                price: 150,
                category: 'Books',
            };

            const res = await chai.request(app).post('/api/items').send(newItem);
            expect(res).to.have.status(201);
            expect(res.body).to.include({ title: 'New Item' });

            const item = await Item.findOne({ title: 'New Item' });
            expect(item).to.exist;
            expect(item).to.include({ title: 'New Item', category: 'Books' });
        });
    });
});
