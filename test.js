import {Selector} from 'testcafe';
import {Eyes} from '@applitools/eyes-images';
const fs = require("fs");
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);

fixture`Getting Started`
  .page`https://applitools.com/helloworld`
  .before(async ctx => {
    const eyes = new Eyes();
    // Set the Applitools API key
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    // Define the OS and hosting application to identify the baseline
    eyes.getHostOS("MacOS 10.14");
    eyes.setHostApp("Chrome 72");
    // Set eyes on the fixture context
    ctx.eyes = eyes;
  })
  .beforeEach(async ({fixtureCtx}) => {
    const {eyes} = fixtureCtx;
    // Start visual testing.
    await eyes.open("Applitools site", "Hello World Test", { width: 700, height: 1000 });
  });


test('hello-world', async t => {
  const {eyes} = t.fixtureCtx;

  // Visual validation point #1
  const img1 = await getImage(t);
  await eyes.checkImage(img1, 'Hello-world page');

  await t.click('div.section.button-section > button')
    .expect(Selector('div.image-section > p').innerText)
    .eql('You successfully clicked the button!');

  // Visual validation point #2
  const img2 = await getImage(t);
  await eyes.checkImage(img2, 'Hello-world after click');

  // End visual testing. Validate visual correctness.
  await eyes.close();
});


const getImage = async t => {
  const fileName = (new Date()).toISOString().replace(/\:/g,' ');
  await t.takeScreenshot(path.join('tmp', fileName));
  const filePath = path.resolve(__dirname, path.join('screenshots', 'tmp', fileName));
  const data = await readFile(filePath);

  fs.unlink(filePath, () => {});
  const thumbPath = path.resolve(__dirname, path.join('screenshots', 'tmp', 'thumbnails', fileName));
  fs.unlink(thumbPath, () => {});
  return data;
};
