import { RequestMock } from 'testcafe';
import SelectAuthenticatorPageObject from '../framework/page-objects/SelectAuthenticatorPageObject';
import IdentityPageObject from '../framework/page-objects/IdentityPageObject';
import xhrIdentify from '../../../playground/mocks/data/idp/idx/identify';
import xhrSuccess from '../../../playground/mocks/data/idp/idx/success.json';
import xhrAuthenticatorVerifySelect from '../../../playground/mocks/data/idp/idx/authenticator-verification-select-authenticator';

const identifyMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(xhrIdentify)
  .onRequestTo('http://localhost:3000/idp/idx/identify')
  .respond(xhrSuccess);

const identifyThenSelectAuthenticatorMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(xhrIdentify)
  .onRequestTo('http://localhost:3000/idp/idx/identify')
  .respond(xhrAuthenticatorVerifySelect);

fixture('Statetoken Page Refresh');

async function setup(t) {
  const identityPage = new IdentityPageObject(t);
  await identityPage.navigateToPage();
  return identityPage;
}

async function setupA(t) {
  const identityPage = new SelectAuthenticatorPageObject(t);
  await identityPage.navigateToPage();
  return identityPage;
}

test.requestHooks(identifyMock)('should set and remove statetoken in sessionStorage upon success', async t => {
  const identityPage = await setup(t);
  let stateToken = await t.eval(() => sessionStorage.getItem('okta-siw-state-token'));
  await t.expect(stateToken !== null).eql(true);
  await identityPage.fillIdentifierField('Test Identifier');
  await identityPage.clickNextButton();
  stateToken = await t.eval(() => sessionStorage.getItem('okta-siw-state-token'));
  await t.expect( stateToken !== null).eql(false);
});

test.requestHooks(identifyThenSelectAuthenticatorMock)('should be able to get the state token from sessionStorage on hard refresh', async t => {
  const identityPage = await setup(t);
  const setupAuthenticatorPage = await setupA(t);
  await identityPage.fillIdentifierField('Test Identifier');
  await identityPage.clickNextButton();
  await t.expect(setupAuthenticatorPage.getFormTitle()).eql('Verify it\'s you with an authenticator');
  await setupAuthenticatorPage.selectFactorByIndex(2);
  await t.eval(() => location.reload());

  const stateToken = await t.eval(() => sessionStorage.getItem('okta-siw-state-token'));
  await t.expect( stateToken !== null).eql(true);
});

test.requestHooks(identifyThenSelectAuthenticatorMock)('should remove token from sessionStorage on sign out', async t => {
  const identityPage = await setup(t);
  const setupAuthenticatorPage = await setupA(t);
  await identityPage.fillIdentifierField('Test Identifier');
  await identityPage.clickNextButton();
  await t.expect(setupAuthenticatorPage.getFormTitle()).eql('Verify it\'s you with an authenticator');
  await setupAuthenticatorPage.clickSignOutLink();
  const stateToken = await t.eval(() => sessionStorage.getItem('okta-siw-state-token'));
  await t.expect( stateToken !== null).eql(false);
});
