const app = require('../server');
const supertest = require('supertest');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
  expect.extend({ toMatchImageSnapshot });

test('runs without crashing',async ()=>{
  await expect(()=>{
    supertest(app);
  }).not.toThrow();
});

describe('the static files are served correctly', () => {
  test('index.html', async (done) => {
    supertest(app)
      .get('/index.html')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(()=>done());
  });
  test('/ returns index.html', async (done) => {
    supertest(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(()=>done());
  });
  test('script.js', async (done) => {
    supertest(app)
      .get('/script.js')
      .expect('Content-Type', /((application)|(text))\/((javascript)|(ecmascript))/)
      .expect(200)
      .then(()=>done());
  });
  test('style.css', async (done) => {
    supertest(app)
      .get('/style.css')
      .expect('Content-Type', /text\/css/)
      .expect(200)
      .then(()=>done());
  });
  
});

test('missing memes return 404', async (done) => {
  supertest(app)
    .get('/ERROR-NO-MEME-HERE')
    .expect(404)
    .then(()=>done())
    .catch(e => {throw e} );
});

test('Will serve a meme', async (done) => {
  supertest(app)
    .get('/kermit?t1=Neighbors complain about flies near their house')
    .expect(200)
    .expect('Content-Type', 'image/png')
    .then(()=>done())
    .catch(e => {throw e} );
});

describe('meme regression testing', () => {
  test('Will serve a meme', async (done) => {
    supertest(app)
      .get('/kermit?t1=Neighbors complain about flies near their house')
      .expect(200)
      .expect('Content-Type', 'image/png')
      .then((res) => { expect(res.body).toMatchImageSnapshot(); })
      .then(()=>done())
      .catch(e => {throw e} );
  });
});