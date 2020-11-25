const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const { evaluate2 } = require('puppeteer-evaluate2');

dotenv.config();

// requiring Controllers:
const discordCtrl = require('./controllers/discord.js');
const logger = require('./controllers/logger.js');
const mode = process.argv[2] === 'production'

function countEntries(object) {
    let count = 0;
    Object.keys(object).map(function(prop) {
        count+= object[prop].length;
    });

    return count
};

(async () => {
    const browser = await puppeteer.launch({ headless: mode });
    const page = await browser.newPage();

    await page.setViewport({
        width: 900,
        height: 900
    });

    logger.log(`Navigating to ${process.env.SOURCE}`)

    await page.goto(process.env.SOURCE)
        .catch((e) => {
            logger.error(`Couldn't navigate to ${process.env.SOURCE}`)
            process.exit(0);
        });

    logger.ready('Page loaded');

    await page.waitForSelector('#agree_button', {timeout:process.env.TIMEOUT})
        .then(() => {
            page.click('#agree_button')
        })
        .catch((e) => {
            logger.error(`Timed out for agreement modal`)
        });

    const userInput = await page.$('input#user_id')
        .catch((e) => {
            logger.error("No login input found");
            process.exit(0);
        });

    const passInput = await page.$('input#password')
        .catch((e) => {
            logger.error("No password input found");
            process.exit(0);
        });

    logger.log('Inserting login data');

    await userInput.click();
    await userInput.type(process.env.LOGIN);

    await passInput.click();
    await passInput.type( process.env.PASSWORD);

    const loginButton = await page.$('input#entry-login');
    await loginButton.click();

    logger.log('Waiting for login response');

    const navigationPromise = await page.waitForNavigation();

    const loginFail = await page.$('div#loginErrorMessage'). then (res => !!res);

    if (loginFail) {
        let error = await page.evaluate(() => {
            return document.querySelector('div#loginErrorMessage').textContent || 'No error message or invalid element.'
        });

        logger.error(error);
        process.exit(0)
    } else {
        logger.ready("Logged in!")
    }

    logger.log('Waiting for dashboard initialization')

    await page.waitForSelector('button[ng-class]');
    await page.goto(`${process.env.SOURCE}/ultra/stream`);

    logger.ready('Dashboard initialized')
    logger.log("Fetching course data")

    await page.waitForSelector('div.js-upcomingStreamEntries > ul');
    const homeworkData = await evaluate2(page, './controllers/homework.js')

    logger.ready('Built course data')

    discordCtrl(homeworkData[0], "Hoje", "Trabalhos a serem entregues", true)
    discordCtrl(homeworkData[1], "Próximos", "Trabalhos futuros", false, "#42a4f5")

    logger.ready(`BB Notify finished; Sent a total of ` + countEntries(homeworkData) + ` entries`);

})();

// console.log(fetchData)