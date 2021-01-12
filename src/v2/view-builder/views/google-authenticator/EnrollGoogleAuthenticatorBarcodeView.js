import { View } from 'okta';
import hbs from 'handlebars-inline-precompile';

export default View.extend({
  className: 'oie-enroll-google-authenticator-barcode',
  template: hbs`
      {{#if href}}
      <div class="google-authenticator-setup-info-title">{{i18n code="oie.enroll.google_authenticator.scanBarcode.title" bundle="login"}}</div>
      <div class="qrcode-info-container">
        <p class="google-authenticator-setup-info">
          {{i18n code="oie.enroll.google_authenticator.scanBarcode.description" bundle="login"}}
        </p>
        <div class="qrcode-container">
          <img class="qrcode" src={{href}} alt="qr code"></img>
          <a href="#" class="cannot-scan-link">
            {{i18n code="oie.enroll.google_authenticator.scanBarcode.cannotScan" bundle="login"}}
          </a>
        </div>
        </div>
      {{/if}}
    `,

  getTemplateData () {
    const contextualData = this.options.appState.get('currentAuthenticator').contextualData;
    return { href: contextualData.qrcode?.href };
  },

  postRender () {
    this.$el.find('.cannot-scan-link').on('click', (event) => {
      event.preventDefault();
      this.options.model.trigger('triggerBarcodeView');
    });
  },
});
