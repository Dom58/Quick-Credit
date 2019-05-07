import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js'

const { expect } = chai;
chai.use(chaiHttp);

describe('Homepage message', () => {
    it('should navigate index page', () =>{
        chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
      });
      });
});