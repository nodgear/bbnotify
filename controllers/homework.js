// Just in case you're wondering why theres an ES6 export syntax while the entire project is using require
// pupeteer evaluate2 transpiles/does his magic using this file as argument, therefore it's not directly loaded to node!
export default function() {
    const tdList = document.querySelector('div.js-todayStreamEntries > ul');
    const tdItems = tdList.getElementsByTagName('li');

    const ntList = document.querySelector('div.js-upcomingStreamEntries > ul');
    const ntItems = ntList.getElementsByTagName('li');

    let tdCourses = [];
    let ntCourses = [];

    for (let i = 0; i < tdItems.length; i++ ) {
        let li = tdItems[i]
        let course = li.querySelector("[analytics-id='stream.entry.course']").textContent;
        let homeWork = li.querySelector("a[analytics-id='stream.entry.title']").textContent;
        let dueDate = li.querySelector("span.due-date > bb-translate > bdi").textContent;
        let postDate = li.querySelector("div.js-split-datetime > span.date").textContent;

        // Who did this on bb?
        course = course.replace("Data de entrega:", "");
        homeWork = homeWork.replace("Data de entrega:", "")
        homeWork = homeWork.replace("A ser entregue hoje:", "")

        tdCourses.push({
            course: course,
            title: homeWork,
            delivery: dueDate,
            posted: postDate
        });
    };

    for (let i = 0; i < ntItems.length; i++ ) {
        let li = ntItems[i]
        let course = li.querySelector("[analytics-id='stream.entry.course']").textContent;
        let homeWork = li.querySelector("a[analytics-id='stream.entry.title']").textContent;
        let dueDate = li.querySelector("span.due-date > bb-translate > bdi").textContent;
        let postDate = li.querySelector("div.js-split-datetime > span.date").textContent;

        // Who did this on bb?
        course = course.replace("Data de entrega:", "");
        homeWork = homeWork.replace("Data de entrega:", "")
        homeWork = homeWork.replace("A ser entregue hoje:", "")

        ntCourses.push({
            course: course,
            title: homeWork,
            delivery: dueDate,
            posted: postDate
        });
    };

    return [tdCourses, ntCourses]
}
