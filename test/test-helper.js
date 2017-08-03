import { JSDOM } from 'jsdom';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
window.Date = global.Date;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
global.expect = expect;
global.sinon = sinon;
copyProps(window, global);

// this has to happen after the globals are set up because `chai-enzyme`
// will require `enzyme`, which requires `react`, which ultimately
// requires `fbjs/lib/ExecutionEnvironment` which (at require time) will
// attempt to determine the current environment (this is where it checks
// for whether the globals are present). Hence, the globals need to be
// initialized before requiring `chai-enzyme`.
chai.use(require('chai-enzyme')());
