'use client';

import { Box, Text, Image, Flex } from "@chakra-ui/react";
import NextImage from "next/image";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({children}) => {
  return (
    <Flex minHeight="100vh" w="100%" justifyContent="center" alignItems="center">
      <Box maxW="700px" w="100%" p={4}>
        {children}
      </Box>
    </Flex>
  );
};
