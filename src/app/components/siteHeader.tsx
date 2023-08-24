'use client';

import { Box, Text, Image, Flex } from "@chakra-ui/react";
import NextImage from "next/image";

export const SiteHeader: React.FC = () => {
  return (
    <Flex p={3} borderBottom="1px solid" borderColor="gray.400" bg="white">
      <Box maxW="200px">
        <Image src="/assets/invoicanator.png" alt="Invoicanator company logo" width="100%"/>
      </Box>
    </Flex>
  );
};
