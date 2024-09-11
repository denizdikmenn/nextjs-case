"use client"

import { useEffect, useState } from "react";
import { iSuggestion } from "../services/data";
import { getSuggestions } from "../actions";
import { Button, Card, CardBody, CardHeader, Center, Heading, SimpleGrid, Wrap, WrapItem, Text} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

export const Suggestions = (props) => {
    
    const [suggestions, setSuggestions] = useState<iSuggestion[] | null>();

    useEffect(() => {
        if(suggestions?.length == 0 || !suggestions || suggestions == null){
            getSuggestions().then(res => {
                setSuggestions(res)
                console.log(res, "END API CALL RES SUGGEST")
            })
        }
    });

    return (
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {suggestions && suggestions?.map((item,i) => 
            <AnimatePresence mode="wait">
                <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                >
                <Card onClick={() => props?.inputRef?.current?.focus(item.companyWebsite)}>
                    <CardHeader>
                    <Heading size='md'>{item.companyName}</Heading>
                    </CardHeader>
                    <CardBody>
                    <Text>{item.companySummary}</Text>
                        <Wrap spacing='0.5rem' justify="start" className="mt-4">
                            {item.industry.map((item,i) => 
                            <WrapItem>
                                <Center bg="gray.400" color={"#FFFFFF"} className="rounded-md p-1">
                                    {item}
                                </Center>
                            </WrapItem>)}
                        </Wrap>
                        <Button className="mt-4">{item.companyWebsite.slice(0, 22)}</Button>
                    </CardBody>
                </Card>
                </motion.div>
            </AnimatePresence>
            )}
        </SimpleGrid>
    )
}