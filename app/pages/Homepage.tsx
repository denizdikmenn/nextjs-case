'use client'

import { useState, useEffect, useRef } from "react"
import { CompanyCard, SearchInput, Suggestions } from "../components/index"
import { iCompany } from "../services/data"
import { getAIResponse } from "../actions";
import {useRouter, useSearchParams} from 'next/navigation'
import { Box, Button, Highlight, Stack, Text } from "@chakra-ui/react";
import { Loader } from "../components/Loader";
import { ArrowBackIcon } from '@chakra-ui/icons'
import { motion } from "framer-motion";
import Image from 'next/image'
import banner from '../banner.jpg';

export const Homepage = () => {

    const searchParams = useSearchParams()
    const searchQuery = searchParams && searchParams.get("q"); 

    const [companyData, setCompanyData] = useState<iCompany | null>();

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(searchQuery?.length){
            setLoading(true)
            console.log("START API CALL")
            getAIResponse(searchQuery).then(res => {
                setCompanyData(res)
                console.log(res, "END API CALL RES")
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [searchQuery]);
    
    const inputRef = useRef(null);

    const router = useRouter()

    return (
        <div className="">
            {companyData && (
            <Button size='md' className="bg-transparent rounded-md border-2" onClick={() => {
                router.push("/")
                setCompanyData(null)
                setLoading(false)
            }}>
                <ArrowBackIcon color='black.500'/> Back
            </Button>)}
            <div className="flex flex-row">
                {(!companyData && !loading) && (
                    <motion.div
                    className="w-3/5 p-5"
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    >
                    <div className="flex flex-row my-4">
                        <svg viewBox="0 0 16 16" fill="#013565" focusable="false" height="6em" width="6em" xmlns="http://www.w3.org/2000/svg"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"></path></svg>
                        <Text as="h2" fontSize="5xl" fontWeight="700" className="text-start py-3" color={"#013565"}>Unlock the Power of Insight.</Text>            
                    </div>
                    <Text as="h2" fontSize="xl" fontWeight="500" className="text-start py-1 my-2">
                        <Highlight
                            query='comprehensive insights'
                            styles={{ px: '1', py: '0.5', rounded: 'full', bg: "gray.400", color:"#FFFFFF" }}
                        >
                            Transform your decision-making with our innovative tool that analyzes data from web and public sources to deliver comprehensive insights about companies.
                        </Highlight>
                    </Text>
                    <Text as="h2" fontSize="xl" fontWeight="300" className="text-start py-1 my-2 bg-">
                        <Highlight
                            query={["financial performance", "market trends", "competitive analysis"]}
                            styles={{ px: '1', py: '0.5', rounded: 'full', bg: "gray.400", color:"#FFFFFF" }}
                        >
                            Discover essential information at your fingertips: from  company summaries and financial performance to market trends and competitive analysis. Stay ahead of the curve and make informed business decisions with actionable insights tailored just for you.
                        </Highlight>
                    </Text>
                    <Box p={4} rounded="md"> 
                        <Image
                            className="rounded-lg"
                            src={banner}
                            width={700}
                            alt="Banner"
                        />
                    </Box>
                </motion.div>
                )}
                <motion.div
                    className={`${(!companyData && !loading) ? "w-2/5" : "w-full"} mt-auto mb-auto p-5`}
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                >
                    <div className="flex flex-row my-2">
                        <Text fontSize="xl" fontWeight="300" color="#013565">Explore...</Text>
                        <Text fontSize="xl" fontWeight="300" color="#013565">Analyze...</Text>
                        <Text fontSize="xl" fontWeight="300" color="#013565">Succeed...</Text>
                    </div>
                    <Text fontSize="xl" fontWeight="500" color="#013565" className="my-2">Get Started Here</Text>
                    <SearchInput loading={loading} ref={inputRef}/>
                    {(!companyData && !loading) && (<Suggestions inputRef={inputRef}/>)}
                </motion.div>
            </div>
            <div className="w-full">
                {loading && (<Stack direction='row' className="my-8 flex justify-center" spacing={4}>
                    <div>
                        <Loader/>
                        <Text className="my-12 text-center" color={"#013565"}>This may take a while...</Text>
                    </div>
                </Stack>)}
                <section className="flex">
                    {(companyData && !loading) && (<CompanyCard company={companyData}/>)}
                </section>
            </div>
        </div>
    )
 }
 