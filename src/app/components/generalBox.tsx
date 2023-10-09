'use client';

import { Box,BoxProps, Text, Image, Flex } from "@chakra-ui/react";
import NextImage from "next/image";

interface GeneralBoxProps {
  children: React.ReactNode;
}

interface GeneralBoxProps extends BoxProps{}

export const GeneralBox: React.FC<GeneralBoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      borderRadius={5}
      bg="white"
      p={3}
      mb={5}
      {...rest}
    >
      {children}
    </Box>
  );
};
