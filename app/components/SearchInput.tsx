"use client"

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, forwardRef, useImperativeHandle } from "react";
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'

export const SearchInput = forwardRef(function SearchInput(props, ref) {
    
    const router = useRouter()
    
    const [inputValue, setValue] = useState("")

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>{
        const inputValue = event.target.value;
        setValue(inputValue);
    }

    const handleSearch = () => {
        if (inputValue) return router.push(`/?q=${inputValue}`);
        if (!inputValue) return router.push("/")
    }

    const handleKeyPress = (event: { key: any; }) => {
        if (event.key === "Enter") return handleSearch()
    }

    useImperativeHandle(ref, () => {
        return {
            focus(val: string) {
              setValue(val)
            },
          };
    }, []);

    return (
        <div className="items-center justify-items-center flex mx-auto ml-auto ms-auto my-5">
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Search2Icon color='gray.300'/>
                </InputLeftElement>
                <Input placeholder="Paste here the company url..."
                    focusBorderColor="black"
                    value={inputValue ?? ""} 
                    onChange={handleChange}
                    onKeyDown={handleKeyPress} 
                    disabled={props.loading}
                />
            </InputGroup>
        </div>
    )
});