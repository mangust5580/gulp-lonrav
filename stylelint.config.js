
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
  ],

  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/public/**',
    '**/.git/**',
  ],

  rules: {
    
    'no-descending-specificity': null, 
    'selector-class-pattern': null,     

    
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
}
