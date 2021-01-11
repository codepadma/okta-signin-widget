import { BaseModel, _ } from 'okta';
import Expect from 'helpers/util/Expect';
import $sandbox from 'sandbox';
import PasswordBox from 'views/shared/PasswordBox';

Expect.describe('TextBox', function () {
  it('has appropriate attributes for autoComplete', function () {
    const textbox = new PasswordBox({
      model: new BaseModel(),
      id: _.uniqueId('passwordbox'),
      autoComplete: 'current-password',
    });

    $sandbox.html(textbox.render().el);
    const input = textbox.$('#' + textbox.options.inputId);

    expect(input.attr('autocomplete')).toEqual('current-password');
  });
});
