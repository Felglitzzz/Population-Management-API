import { expect } from 'chai';
import mongoose from 'mongoose';
import request from "supertest";
import app from "../server/index";
import util from 'util';
import dotenv from 'dotenv';
import { doesNotReject } from 'assert';
import Location from '../server/database/model/location.model';


dotenv.config()

const {DATABASE_NAME: dbName, DATABASE_SERVER:dbServer } = process.env

const testUrl = `mongodb://${dbServer}/${dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(testUrl);
mongoose.connection
  .once('open', () => console.log('connected to test database'))
  .on('error', (error) => {
      console.warn('Error occurred connecting to test database : ',error);
  });

const server = request(app)
let seed;
let seedWithNoSublocation;
let seedWithSublocation
describe('POPULATION MANAGEMENT API TEST', () => {
  before(async() => {
    await mongoose.connection.collections.locations.drop();
    console.log("locations collection dropped")
    const seedLocation = new Location({
      name: 'ikeja',
      subLocations: [{
        maleCount: 2,
        femaleCount: 4,
        subLocationName: 'alausa',
      }]
    })

    seedLocation.save().then(record => {
      seed = record
    })
  })

  describe('LOCATION POST ENDPOINT', () => {
    it('should create apex location', async () => {
      const response = await server
        .post('/api/v1/locations/apex')
        .set("Accept", "Application/json")
        .send({
          name: "eti-osa",
          maleCount: 3,
          femaleCount: 3,
          subLocationName: "VI"
        })
          const {message, data} = response.body;
        expect(message).to.equal('Apex Location and sublocation created successfully')
        expect(data.subLocations.length).to.equal(1)
        expect(data.subLocations[0].subLocationName).to.equal('VI')
        expect(data.subLocations[0].totalCount).to.equal(6)
        expect(data.name).to.equal('eti-osa')

    })

    it("should throw error when maleCount is not supplied in the request body for \'/api/v1/locations/apex\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/apex')
        .set("Accept", "Application/json")
        .send({
          name: "eti-osa",
          femaleCount: 3,
          subLocationName: "VI"
        })
          const {message, data} = response.body;
        expect(message).to.equal('Number of male resident field is required')
    })

    it("should throw error when femaleCount is not supplied in the request body for \'/api/v1/locations/apex\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/apex')
        .set("Accept", "Application/json")
        .send({
          name: "eti-osa",
          maleCount: 3,
          subLocationName: "VI"
        })
          const {message, data} = response.body;
        expect(message).to.equal('Number of female resident field is required')
    })

    it("should throw error when sublocation name is not supplied in the request body for \'/api/v1/locations/apex\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/apex')
        .set("Accept", "Application/json")
        .send({
          name: "eti-osa",
          maleCount: 3,
          femaleCount: 3
        })
         const {message, data} = response.body;
        expect(message).to.equal('Name of sublocation is required')
    })

    it("should throw error when name is not supplied in the request body for \'/api/v1/locations/apex\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/apex')
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          femaleCount: 3,
          subLocationName: "VI"

        })
         const {message, data} = response.body;
        expect(message).to.equal('Name of apex location is required')
    })


    it('should create sub location', async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          parentId: seed._id,
          maleCount: 9,
          femaleCount: 9,
          subLocationName: "alausa"
        })
          const {message, data} = response.body;
          seedWithSublocation = data
          expect(message).to.equal('sublocation added to apex location successfully')
          expect(data.subLocations.length).to.equal(2)
          expect(data.subLocations[1].subLocationName).to.equal('alausa')

    })

    it("should return 500 if no apex location is not found for '/api/v1/locations/sub'", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          parentId: 'wrongId',
          maleCount: 9,
          femaleCount: 9,
          subLocationName: "alausa"
        })
          const {message} = response.body;
          expect(message).to.equal('error occured adding a sublocation to apex location')
    })

    it("should throw error when maleCount is not supplied in the request body for \'/api/v1/locations/sub\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          femaleCount: 3,
          subLocationName: "VI",
          parentId: 'parentId'

        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of male resident field is required')
    })

    it("should throw error when femaleCount is not supplied in the request body for \'/api/v1/locations/sub\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          subLocationName: "VI",
          parentId: 'parentId'
        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of female resident field is required')
    })

    it("should throw error when subLocationName is not supplied in the request body for \'/api/v1/locations/sub\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          femaleCount: 3,
          parentId: 'parentId'

        })
        const {message, data} = response.body;
        expect(message).to.equal('Name of sublocation is required')
    })

    it("should throw error when parentId is not supplied in the request body for \'/api/v1/locations/sub\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          femaleCount: 3,
          subLocationName: "VI"
        })
        const {message, data} = response.body;
        expect(message).to.equal('apex location id is required')
    })


    it('should create location with no sublocation', async () => {
      const response = await server
        .post('/api/v1/locations/')
        .set("Accept", "Application/json")
        .send({
          maleCount: 9,
          femaleCount: 9,
          name: "agbara"
        })
          const {message, data} = response.body;
          seedWithNoSublocation = data
          expect(message).to.equal('Location created successfully')
          expect(data.name).to.equal('agbara')
    })

    it("should return error if location is apex for '/api/v1/locations/sub'", async () => {
      const response = await server
        .post('/api/v1/locations/sub')
        .set("Accept", "Application/json")
        .send({
          parentId: seedWithNoSublocation._id,
          maleCount: 9,
          femaleCount: 9,
          subLocationName: "alausa"
        })
          const {message} = response.body;
          expect(message).to.equal('location does not have sub locations')
    })

    it("should throw error when maleCount is not supplied in the request body for \'/api/v1/locations\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations')
        .set("Accept", "Application/json")
        .send({
          femaleCount: 3,
          subLocanametionName: "VI"
        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of male resident field is required')
    })

    it("should throw error when femaleCount is not supplied in the request body for \'/api/v1/locations\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations')
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          name: "VI"
        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of female resident field is required')
    })

    it("should throw error when name is not supplied in the request body for \'/api/v1/locations\' endpoint", async () => {
      const response = await server
        .post('/api/v1/locations')
        .set("Accept", "Application/json")
        .send({
          femaleCount: 3,
          maleCount: 3,
        })
        const {message, data} = response.body;
        expect(message).to.equal('Name of location is required')
    })

    it('should get all locations and their resident count', async () => {
      const response = await server
        .get('/api/v1/locations')
        const {message, data} = response.body;
        expect(message).to.equal('locations retrieved successfully')
    })

    it('should update location with no sublocation', async () => {
      const response = await server
        .put(`/api/v1/locations/${seedWithNoSublocation._id}`)
        .set("Accept", "Application/json")
        .send({
          maleCount: 9,
          femaleCount: 9,
          name: "ibiye"
        })
          const {message, data} = response.body;
          expect(message).to.equal('Location updated successfully')
          expect(data.name).to.equal('ibiye')
    })

    it('should update sublocation', async () => {
      const response = await server
        .put(`/api/v1/locations/apex/${seedWithSublocation._id}/sub/${seedWithSublocation.subLocations[1]._id}`)
        .set("Accept", "Application/json")
        .send({
          maleCount: 9,
          femaleCount: 7,
          subLocationName: "ogba"
        })
          const {message, data} = response.body;
          expect(message).to.equal('Location updated successfully')
          expect(data.subLocations.length).to.equal(2)
          expect(data.subLocations[1].subLocationName).to.equal('ogba')
          expect(data.subLocations[1].totalCount).to.equal(16)
    })

    it("should throw error when maleCount is not supplied in the request body for \'/api/v1/locations/apex/:parentId/sub/:id\' endpoint", async () => {
      const response = await server
        .put(`/api/v1/locations/apex/${seedWithSublocation._id}/sub/${seedWithSublocation.subLocations[1]._id}`)
        .set("Accept", "Application/json")
        .send({
          femaleCount: 3,
          subLocationName: "VI",
          parentId: 'parentId'

        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of male resident field is required')
    })

    it("should throw error when femaleCount is not supplied in the request body for \'/api/v1/locations/apex/:parentId/sub/:id\' endpoint", async () => {
      const response = await server
        .put(`/api/v1/locations/apex/${seedWithSublocation._id}/sub/${seedWithSublocation.subLocations[1]._id}`)
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          subLocationName: "VI",
          parentId: 'parentId'

        })
        const {message, data} = response.body;
        expect(message).to.equal('Number of female resident field is required')
    })

    it("should throw error when subLocationName is not supplied in the request body for \'/api/v1/locations/apex/:parentId/sub/:id\' endpoint", async () => {
      const response = await server
        .put(`/api/v1/locations/apex/${seedWithSublocation._id}/sub/${seedWithSublocation.subLocations[1]._id}`)
        .set("Accept", "Application/json")
        .send({
          maleCount: 3,
          femaleCount: 3,
          parentId: 'parentId'

        })
        const {message, data} = response.body;
        expect(message).to.equal('Name of sublocation is required')
    })

    it('should update apex location', async () => {
      const response = await server
        .put(`/api/v1/locations/apex/${seedWithSublocation._id}`)
        .set("Accept", "Application/json")
        .send({
          name: "maryland"
        })
          const {message, data} = response.body;
          expect(message).to.equal('apex location name updated successfully')
    })

    it('should delete location', async () => {
      const response = await server
        .delete(`/api/v1/locations/${seedWithNoSublocation._id}`)
        .set("Accept", "Application/json")
          const {message, data} = response.body;
          expect(message).to.equal('location removed successfully')
    })

    it('should delete sublocation', async () => {
      const response = await server
        .delete(`/api/v1/locations/apex/${seedWithSublocation._id}/sub/${seedWithSublocation.subLocations[1]._id}`)
        .set("Accept", "Application/json")
          const {message, data} = response.body;
          expect(message).to.equal('sublocation deleted successfully')
    })
  })

  describe("HOME ENDPOINT", () => {
    it("should get welcome message", async () => {
      const response = await server
        .get('/api/v1/home/')
          const {message} = response.body;
        expect(message).to.equal('Welcome to Population Management API')
    })
  })
})