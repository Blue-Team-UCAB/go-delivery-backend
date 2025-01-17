module.exports = {
  default: {
    require: ['./setup-cucumber.ts', './test/**/*.steps.ts'],
    format: ['progress'],
    paths: ['./test/**/*.feature'],
    requireModule: ['ts-node/register'],
  },
};
