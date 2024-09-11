import Link from "next/link";
import { iCompany } from "../services/data";
import { Heading, ListItem, Image, Stack, Text, UnorderedList, Divider, Box, Button } from '@chakra-ui/react';
import { ArrowRightIcon } from "@chakra-ui/icons";

export const CompanyCard = (props: { company: iCompany; }) => {
    
    const { summary, 
            companyName, 
            team, 
            problem_solution, 
            product, 
            sales_marketing, 
            market_competiton,
            revenue_model,
            conclusion_kpi,
            logo, 
            country, 
            lead_market, 
            funding_stage,
            teamRefs,
            teamSize,
            fundraising
        } = props.company;
    
    return (
        <div className='shadow-sm border border-slate-200 my-4 rounded-lg'>
            <div className="flex flex-row">
                {logo && (<Image
                    borderRadius='full'
                    boxSize='6rem'
                    src={logo}
                    alt='Dan Abramov'
                    className="justify-self-center self-center m-2 p-2"
                />)}
                <Text fontSize='4xl' className="align-middle mt-auto mb-auto">{companyName}</Text>
                <div className="float-end w-2/5 ms-auto mt-auto mb-auto">
                    <Text fontSize='xl' className="align-middle mt-auto mb-auto"><b>Country:</b> {country}</Text>
                    <Text fontSize='xl' className="align-middle mt-auto mb-auto"><b>Lead Market:</b> {lead_market}</Text>
                    <Text fontSize='xl' className="align-middle mt-auto mb-auto"><b>Funding Stage:</b> {funding_stage}</Text>
                </div>
            </div>
            <Divider orientation='horizontal' />
            <div className="flex flex-row">
                <div className="flex flex-col my-2 bg-white w-2/4">
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Summary
                            </Heading>
                            <Text>{summary}</Text>
                        </Stack>
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Team
                            </Heading>
                            {teamRefs?.map((item,i) => 
                                <Link href={item?.ref} rel="noopener noreferrer" target="_blank" className="me-auto ms-0 w-5/6">
                                <Box className="flex flex-row border-2 rounded-md p-2">
                                    <div>
                                        <Text as="b" className="py-1">{item?.name}</Text>
                                        <Text className="py-1">{item?.title}</Text>
                                    </div>
                                    <Button className="ms-auto align-middle mt-auto mb-auto">
                                        <ArrowRightIcon color='black.500' className="" />
                                    </Button>
                                </Box>
                                </Link>)}
                                <Text>Total employees: {teamSize}</Text>
                        </Stack>
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Problem & Solution
                            </Heading>
                            <UnorderedList>
                                <ListItem><Text as="b">Problem: </Text> {problem_solution?.problem}</ListItem>
                                <ListItem><Text as="b">Solution: </Text> {problem_solution?.solution}</ListItem>
                            </UnorderedList>
                        </Stack>
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Product
                            </Heading>
                            <UnorderedList>
                                {product?.map((item,i) => <ListItem>{item}</ListItem>)}
                            </UnorderedList>
                        </Stack>
                    </div>
                </div> 
                <div className="relative flex flex-col my-2 bg-white w-2/4">
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Sales & Marketing
                            </Heading>
                            <UnorderedList>
                                <ListItem><Text as="b">Sales: </Text> {sales_marketing?.sales}</ListItem>
                                <ListItem><Text as="b">Marketing: </Text> {sales_marketing?.marketing}</ListItem>
                            </UnorderedList>
                        </Stack>
                    </div>
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Market & Competition
                            </Heading>
                            <UnorderedList>
                                <ListItem><Text as="b">Differentiation: </Text> {market_competiton?.differentiation}</ListItem>  
                                <ListItem><Text as="b">Competitors: </Text>
                                {market_competiton?.competitor_companies?.map((item,i) => 
                                    <Link href={item?.website_url} rel="noopener noreferrer" target="_blank" className="me-auto ms-0 w-5/6">
                                        <Box className="flex flex-row border-2 rounded-md p-2 my-2">
                                            <div>
                                                <Text as="b" className="py-1">{item?.name}</Text>
                                                <Text className="py-1">{item?.companyDescription}</Text>
                                            </div>
                                            <Button className="ms-auto align-middle mt-auto mb-auto">
                                                <ArrowRightIcon color='black.500' className="" />
                                            </Button>
                                        </Box>
                                    </Link>)}
                                </ListItem>
                            </UnorderedList>
                        </Stack>
                    </div>
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Revenue Model
                            </Heading>
                            <Text>{revenue_model}</Text>
                        </Stack>
                    </div>
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Conclusion & KPI
                            </Heading>
                            <UnorderedList>
                                <ListItem><Text as="b">Conclusion: </Text> {conclusion_kpi?.conclusion}</ListItem>
                                <ListItem><Text as="b">KPIs: </Text> {conclusion_kpi?.KPIs}</ListItem>
                            </UnorderedList>
                        </Stack>
                    </div>
                    <div className="p-2">
                        <Stack spacing={1} className='my-4'>
                            <Heading as='h6' size='md' noOfLines={1}>
                                Fundraising
                            </Heading>
                            <Text>{fundraising}</Text>
                        </Stack>
                    </div>
                </div>  
            </div>
        </div>
    )
}