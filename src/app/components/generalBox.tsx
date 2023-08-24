'use client';

import { Box, Text, Image, Flex } from "@chakra-ui/react";
import NextImage from "next/image";

interface GeneralBoxProps {
  children: React.ReactNode;
}

export const GeneralBox: React.FC<GeneralBoxProps> = ({children}) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      borderRadius={5}
      bg="white"
      p={3}
      mb={5}
    >
      {children}
    </Box>
  );
};
