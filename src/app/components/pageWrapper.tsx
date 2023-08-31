'use client';

import { Box, Flex } from "@chakra-ui/react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({children}) => {
  return (
    <Flex minHeight="100vh" w="100%" justifyContent="center" alignItems="center">
      <Box maxW="800px" w="100%" p={4}>
        {children}
      </Box>
    </Flex>
  );
};
