const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

// requiring Controllers:
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({
        width: 900,
        height: 900
    });

    await page.goto(process.env.SOURCE)
        .catch((e) => {

            console.log(`Trying to get navigate to ${process.env.SOURCE} and failed.`)
        });

    // Blackboard may take ages to load, let's wait
    await page.waitForSelector('#agree_button', {timeout:process.env.TIMEOUT})
        .then(() => {
            page.click('#agree_button')
        })
        .catch((e) => {
            console.log(`Timed out while waiting for privacy agreement.\n Kept going.`)
        });

    const userInput = await page.$('input#user_id')
        .catch((e) => {
            console.log("Can't find login, if you logged manually, please restart", e)
        });

    const passInput = await page.$('input#password')
        .catch((e) => {
            console.log("The DOM changed, please check the elementQuery");
        });

    if ( ( userInput == null) || (passInput == null ) ) {
        process.exit(0);
    }

    await page.focus('input#user_id');
    await page.type('input#user_id', process.env.LOGIN);

    await page.focus('input#password');
    await page.type('input#password', process.env.PASSWORD);

    await page.click('input#entry-login');

    await page.waitForSelector('button[ng-class]');
    await page.goto(`${process.env.SOURCE}/ultra/stream`);

    await page.waitForSelector('div.js-upcomingStreamEntries > ul');

    const toDeliver = await page.evaluate( () => {
        const element = 'div.js-upcomingStreamEntries > ul'
        const upComming = document.querySelector(element);
        const items = upComming.getElementsByTagName('li');

        let courses = [];

        for (let i = 0; i < items.length; i++ ) {
            let li = items[i]
            let course = li.querySelector("[analytics-id='stream.entry.course']").textContent;
            let homeWork = li.querySelector("a[analytics-id='stream.entry.title']").textContent;
            let dueDate = li.querySelector("span.due-date > bb-translate > bdi").textContent;
            let postDate = li.querySelector("div.js-split-datetime > span.date").textContent;

            // Who did this?
            course = course.replace("Data de entrega:", "");
            homeWork = homeWork.replace("Data de entrega:", "")
            homeWork = homeWork.replace("A ser entregue hoje:", "")

            courses.push({
                course: course,
                title: homeWork,
                delivery: dueDate,
                posted: postDate
            });
        };

        return courses
    });


    await page.waitForSelector('div.js-todayStreamEntries > ul');

    const addedToday = await page.evaluate( () => {
        const element = 'div.js-todayStreamEntries > ul'
        const upComming = document.querySelector(element);
        const items = upComming.getElementsByTagName('li');

        let courses = [];

        for (let i = 0; i < items.length; i++ ) {
            let li = items[i]
            let course = li.querySelector("[analytics-id='stream.entry.course']").textContent;
            let homeWork = li.querySelector("a[analytics-id='stream.entry.title']").textContent;
            let dueDate = li.querySelector("span.due-date > bb-translate > bdi").textContent;
            let postDate = li.querySelector("div.js-split-datetime > span.date").textContent;

            // Who did this?
            course = course.replace("Data de entrega:", "");
            homeWork = homeWork.replace("Data de entrega:", "")
            homeWork = homeWork.replace("A ser entregue hoje:", "")

            courses.push({
                course: course,
                title: homeWork,
                delivery: dueDate,
                posted: postDate
            });
        };

        return courses
    });



    const embedToday = new Discord.MessageEmbed()
	.setTitle('Hoje')
    .setDescription('Black Board UniFTC')
    .setColor('#ff3030')
    .setAuthor("Nodge")
    .addFields( buildEmbed(addedToday) )
    .setTimestamp()
    .setThumbnail('https://i.imgur.com/0nbLwdq.png')
    .setFooter('Botentinha BlackBoard :)');

    webhookClient.send('@everyone', {
        username: 'Botentinha',
        avatarURL: 'https://i.imgur.com/0nbLwdq.png',
        embeds: [embedToday]
    });

    const embedToDeliver = new Discord.MessageEmbed()
	.setTitle('Próximas')
    .setDescription('Black Board UniFTC')
    .setColor('#00ddff')
    .setAuthor("Nodge")
    .addFields( buildEmbed(toDeliver) )
    .setTimestamp()
    .setThumbnail('https://i.imgur.com/0nbLwdq.png')
    .setFooter('Botentinha BlackBoard :)');



    // TODO: Remove awaits using promise global => resolve
})();

// console.log(fetchData)