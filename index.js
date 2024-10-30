// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { expect } = require("playwright/test");
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  function isSorted(arr){
    let count = 1
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[i - 1]) {
          return count;
      }
      count += 1
    }
    return count;
  }

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  const timestamps = []
  while(true){
    if(100 - timestamps.length >= 30){
      const times = await page.$$eval('span.age', (ages)=>{
        return ages.map(age=>{
          return new Date(age.title.split(' ')[0])
        })
      })
      timestamps.push(...times)
      try{
        await page.getByRole('link', {name: 'More', exact: true}).click()
      }catch{
        console.error('Test Failed: Page not loaded')
        break
      }
    }else{
      const times = await page.$$eval('span.age', (ages)=>{
        return ages.map(age=>{
          return new Date(age.title.split(' ')[0])
        })
      })
      timestamps.push(...times.slice(0,(100 - timestamps.length)))
      break
    }
  }
  try{
    expect(timestamps).toHaveLength(100)
    console.log('Test Passed: Obtained 100 articles')
    const sorted = isSorted(timestamps)
    try{
      expect(sorted).toBe(100)
      console.log('Test Passed: Articles are sorted')
    }catch(error){
      console.error(`Test Failed: Articles are not sorted. Check Article ${sorted + 1}`)
      console.log(error.message)
    }
  }catch(error){
    console.error('Test Failed: Could not check 100 articles')
  }
  await browser.close();
}
(async () => {
  await sortHackerNewsArticles();
})();
