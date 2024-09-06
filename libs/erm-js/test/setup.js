import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

window.expect = chai.expect;
window.sinon = sinon;
