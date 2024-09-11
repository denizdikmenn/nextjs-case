export interface iCompetitor {
    name: string,
    companyDescription : string,
    website_url: string
}

export interface iCompany {
    summary: string;
    companyName: string;
    country: string,
    lead_market: string,
    funding_stage: string,
    team: string[];
    problem_solution: {
        problem: string,
        solution: string
    }
    product: string[];
    sales_marketing: {
        sales: string,
        marketing: string
    },
    market_competiton: {
        differentiation: string,
        competitor_companies: iCompetitor[]
    }, 
    conclusion_kpi: {
        conclusion: string,
        KPIs: string
    }, 
    revenue_model: string,
    teamRefs: any,
    teamSize: string,
    logo: string,
    fundraising: string
}

export interface iSuggestion {
    companyName: string,
    companySummary: string,
    industry: string[],
    companyWebsite: string
}
