"use client";

import { Box, Text, Image, Flex } from "@chakra-ui/react";
import NextImage from "next/image";

const defaultStyleProps = {
  border: "1px solid",
  borderColor: "gray.100",
  borderRadius: 5,
  bg: "white",
  p: 3,
  mb: 5,
};

export const GeneralBox = (props: React.ComponentProps<typeof Box>) => {
  const { children } = props;
  return <Box {...{ ...defaultStyleProps, ...props }}>{children}</Box>;
};
