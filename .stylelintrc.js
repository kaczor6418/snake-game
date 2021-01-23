module.exports = {
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'selector-type-no-unknown': null, // because of web-components
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  }
};
