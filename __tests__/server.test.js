const app = require('../server');
const supertest = require('supertest');


test('runs without crashing',()=>{
  expect(()=>{
    supertest(app);
  }).not.toThrow();
});