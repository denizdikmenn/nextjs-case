"use server";

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import * as puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

async function getTextFromLink(url: string, browser: any) {

  try {
   
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.setJavaScriptEnabled(false);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 10000
    });

    const textContent = await page.evaluate(() => {
      return document?.body?.innerText;
    });

    return textContent;
  
  } catch (error) {
    return ""
  }
}

export async function getSuggestions() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const jsonSchema = z.object({
    companyName: z.string(),
    companySummary: z.string(),
    industry:  z.array(z.string()),
    companyWebsite: z.string()
  });

  const listSchema = z.object({
    list: z.array(jsonSchema)
  }) 

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a data analyst in a venture capital company and an expert of data extraction." },
          {
              role: "user",
              content: `give me 3 outstanding early stage startups to invest. Provide me company website urls of these companies. Do not include broken links or imaginary links that do not direct to company website.`,
          },
      ],
      response_format: zodResponseFormat(listSchema, "suggestions_list"),
  });

  return completion.choices[0].message.parsed?.list
}

async function getCompanyLogoLinkedIn(url: string, browser: any) {

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 10000
    });
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const sourceLogo = await page.$$eval(
      "img.top-card-layout__entity-image[src]",
      (imgs) => imgs.map((img) => img.getAttribute("src")),
    );
  
    const parentDataAttribute = '[data-tracking-control-name="org-employees"]';
    const childSelector = '.base-main-card__title'; 
  
    const combinedSelector = `${parentDataAttribute} ${childSelector}`;
  
    const elements = await page.$$(combinedSelector);
  
    let employeeList = []

    for (const element of elements) {
      const text = await page.evaluate(el => el?.innerText, element);

      const parentHandle = await page.evaluateHandle(el => el.parentElement, element);

      const subtitle = await parentHandle.$(".base-main-card__subtitle");
      const subtitleText = await page.evaluate(el => el?.innerText, subtitle);

      const parentRef = await page.evaluateHandle(el => el.parentElement, parentHandle);

      const ref = await page.evaluate(el => el.href, parentRef);

      employeeList.push({"name": text,"title": subtitleText, "ref": ref})
    }

    console.log(employeeList, "employeeList")

    const teamSizeP = await page.$(".face-pile__text")

    const textTeamSize = await page.evaluate(el => el?.innerText, teamSizeP);

    console.log(textTeamSize, "teamSize");
    
    console.log(sourceLogo, "source");
  
    return {
      teamRefs: employeeList,
      teamSize: textTeamSize,
      logo: sourceLogo
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getAIResponse(url: string) {

  let browser = null;

  if (process.env.NODE_ENV === 'development') {
    console.log('Development browser: ');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  if (process.env.NODE_ENV === 'production') {
    console.log('Development production: ');
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true
    });
  }

  if(browser){
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const hrefs = await page.$$eval("a", (as) => as.map((a) => a.href));
  
    const linkedInRef = hrefs.filter((link) => link.includes("linkedin"))[0];
  
    const linkedInData = await getCompanyLogoLinkedIn(linkedInRef, browser);
  
    let prefix = url.split("https://")[1].replace("/", "");
  
    let uniquerefs = [...new Set(hrefs)].filter((link) => link.includes(prefix));
  
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  
    const FilterListRefs = z.object({
      list: z.array(z.string()),
    });
  
    console.log(uniquerefs, "uniquerefs");
    
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a data analyst in a venture capital company and an expert of data extraction.`,
        },
        { role: "user", content: `Here is the list of some website links of a given company. Pick ${uniquerefs.length > 7 ? 7 : uniquerefs.length} of them for you to give an insight about the company. Do not add anyting to list items only filter it. Exclude the ones might has unneccesary information such as: terms-and-conditions, privacy-policy. List : ${uniquerefs.toString()}.`},
      ],
      response_format: zodResponseFormat(FilterListRefs, "company_list"),
    });
  
    let related_links = completion.choices[0].message.parsed?.list
  
    console.log(related_links, "related_links");
  
    let total_text = "";
  
    for await (const link of related_links) {
      let text = await getTextFromLink(link, browser);
      console.log(text.length);
      total_text += text;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  
    const Competitor = z.object({
      name: z.string(),
      companyDescription : z.string().describe("An overview of the company, including a brief description of their strengths and weaknesses, and how they compare to the company's products or services."),
      website_url: z.string().describe("Current public website url of the company. Do not imagine or presume url that does not exist. It should be accessible in the internet.")
    })
  
  
    const CompanyExtraction = z.object({
      companyName: z.string(),
      country: z.string().describe("An overview of the primary country in which the company operates, including information about the economic and regulatory environment that influences the business landscape."),
      lead_market: z.string().describe("Information about the leading market(s) for the company's products or services, including insights into customer demographics, preferences, and purchasing behavior."),
      funding_stage: z.string().describe("An indication of the current funding stage the company is in (e.g., Seed, Series A, Series B), along with a brief explanation of what this stage typically involves."),
      summary: z.string().describe("A brief description of the company, including its mission, vision, and core values, as well as the industry in which it operates."),
      team: z.array(z.string()),
      problem_solution: z.object({ 
        problem: z.string().describe("A brief description of the main challenges or issues faced by the company, including any relevant data or context that illustrates the severity and urgency of these problems."), 
        solution: z.string().describe("A description of the strategies or actions that the company is implementing or planning to implement to address the identified problems, including key steps, initiatives, or innovations.") }),
      product: z.array(z.string().describe("An overview of the product being offered, including its purpose, target market, and how it fits into the overall company strategy. A detailed list of key features and benefits of the product, highlighting what makes it unique and why it is valuable to customers. A statement that clearly articulates the unique value the product provides to the customer, addressing specific needs or problems it solves.")),
      sales_marketing: z.object({ 
        sales: z.string().describe("A description of the sales approach and tactics used to convert leads into customers, including the sales channels and methods employed."), 
        marketing: z.string().describe("An overview of the marketing strategy employed by the company to reach its target audience, create brand awareness, and generate leads.") }),
      market_competiton: z.object({ 
        differentiation: z.string().describe("An explanation of what sets the company apart from its competitors, highlighting unique selling points, innovations, or value propositions that differentiate its offerings in the market"), 
        competitor_companies: z.array(Competitor).describe("Major competitors in the industry")}),
      revenue_model: z.string().describe("The company employs a subscription-based revenue model that allows customers to access premium features for a monthly fee, providing a steady stream of recurring revenue. Key revenue streams include monthly subscriptions for software services, one-time fees for premium features, and revenue from partnerships with third-party service providers. The pricing strategy"),
      conclusion_kpi: z.object({ 
        conclusion: z.string().describe("A concise summary of the key findings and insights from the report, reinforcing the main points discussed and providing overall reflections on the company's position and outlook."), 
        KPIs: z.string().describe("An overview of the Key Performance Indicators (KPIs) that the company tracks to measure success, including their relevance to overall business objectives. A detailed list of specific KPIs being used by the company, such as revenue growth rate, customer acquisition cost, customer lifetime value, and net promoter score, along with their targets or benchmarks.") }),
      fundraising: z.string().describe("An overview of the company’s funding goals, including the amount of capital being sought, the purpose of the funds (e.g., expansion, product development, operational expenses), and the expected timeline for raising the funds.A list of current investors and stakeholders, detailing their involvement and the amount of investment they have contributed to date, along with any notable partnerships. A description of the strategies and methods the company plans to use for raising funds, including potential funding sources such as venture capital, angel investors, crowdfunding, or loans."),
    });
  
    const completionlast = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            `You are an expert at structured data extraction. You will be given a text about a startup company and should convert the information into the given structure by the text provided and other public resources. 
            Summarize the findings clearly in a well-organized, ready to be used in a report.`,
        },
        { role: "user", content:`Extract the following details from ${total_text} and **OTHER PUBLIC RESOURCES**`},
      ],
      response_format: zodResponseFormat(
        CompanyExtraction,
        "company_analysis_extraction",
      ),
    });
  
    const summary = completionlast.choices[0].message.parsed;
    
    let res = { ...summary, ...linkedInData}; 
    
    console.log(res, "summary");
  
    await browser.close();
  
    return res;
  }
}
