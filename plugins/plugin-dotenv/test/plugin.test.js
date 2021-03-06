const path = require('path');
const execa = require('execa');

const execPluginFilePath = require.resolve('./execPlugin');
const testWorkDirectory = path.join(__dirname, 'env');

function execPlugin(nodeEnv) {
  const {stdout} = execa.sync('node', [execPluginFilePath], {
    cwd: testWorkDirectory,
    env: {NODE_ENV: nodeEnv},
  });
  return JSON.parse(stdout);
}

beforeEach(() => {
  // test that pre-exiting environment variables are not overwritten
  process.env.__DOTENV_PRESET = 'PRESET';
});

const NODE_ENV_LIST = [undefined, 'development', 'test', 'production'];
describe('NODE_ENV=', () => {
  NODE_ENV_LIST.forEach((nodeEnv) => {
    test(`${nodeEnv}`, () => {
      expect(execPlugin(nodeEnv)).toMatchSnapshot();
    });
  });
});
