import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  FlexProps,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { Link as ReactRouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Api from "../../apis/api";

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onLogout: () => void;
  nickname: string;
}

export default function MobileNav({ onOpen, nickname = "워디35", onLogout, ...rest }: MobileProps) {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256");

  useEffect(() => {
    // 사용자 정보 가져오는 API 호출
    Api.get('/user')
      .then((response) => {
        const userData = response.data;
        setUserName(userData.name);
        setUserImage(userData.profileImage || "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=256");
      })
      .catch((error) => {
        console.error('사용자 정보 가져오기 오류:', error);
      });
  }, [userImage]);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height={"20"}
      alignItems={"center"}
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth={"1px"}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant={"outline"}
        aria-label={"open menu"}
        icon={<FiMenu />}
      />
      <ChakraLink as={ReactRouterLink} to="/main">
        <Text
          display={{ base: "flex", md: "none" }}
          fontSize={"2xl"}
          fontFamily={"monospace"}
          fontWeight={"bold"}
        >
          {"🐾 Wordy\r"}
        </Text>
      </ChakraLink>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton size={"lg"} variant={"ghost"} aria-label={"open menu"} icon={<FiBell />} /> */}
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition={"all 0.3s"} _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar
                  size={"sm"}
                  src={userImage}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems={"flex-start"}
                  spacing={"1px"}
                  ml={"2"}
                >
                  <Text fontSize={"sm"}>{userName || nickname}</Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem as={ReactRouterLink} to="/main/mypage">
                {"프로필"}
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={onLogout}>{"로그아웃"}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}
