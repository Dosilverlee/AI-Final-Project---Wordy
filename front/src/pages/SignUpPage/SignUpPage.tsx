import React, { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../../apis/api";
import useDebounced from "../../hooks/useDebounce";
import validateEmail from "../../libs/validateEmail";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import { AxiosError } from "axios";

type NewUserInfoType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

let timer: NodeJS.Timer;

const TOAST_TIMEOUT_INTERVAL = 800;
const SignUp = () => {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState<NewUserInfoType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "", // 이메일 인증 코드 필드 추가
  });

  const { name, email, password, confirmPassword, verificationCode } = newUserInfo;

  const navigate = useNavigate();
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const debounceFetchTerm = useDebounced(email, 500);
  const [sendEmailCodeClick, setSendEmailCodeClick] = useState(false);
  const [succededEmailCode, setSuccededEmailCode] = useState(false);

  const getEmailStatus = () => {
    if (isEmailAvailable) {
      return "사용 가능한 이메일";
    }
    if (isEmailAvailable === false) {
      return "사용중인 이메일";
    }
    if (isEmailAvailable === undefined) {
      return "올바르지 않은 형식";
    }
    return ""; // 반환값이 없을 경우 빈 문자열 반환
  };

  // 1. 중복 검사를 진행한다.
  const fetchEmailCheck = async () => {
    try {
      const res = await Api.get(`/auth/check?email=${email}`);
      setIsEmailAvailable(true);
      if (res.status === 403) {
        setIsEmailAvailable(false);
      } 
      else {
        setIsEmailAvailable(true);
      }
    } catch (e) {
      const customError = e as AxiosError;
      console.log(customError.message);
      setIsEmailAvailable(customError.response.status === 409 ? false : undefined);
    }
  };

  // 2. 이메일 인증 요청을 보낸다.
  const fetchSendEmailCode = async () => {
    try {
      await Api.post(`/auth/register`, { email });
      setSendEmailCodeClick(true);

      // 인증 요청 메일 발송 성공 시 토스트 알람 표시
      toast({
        title: "이메일 인증 요청이 성공적으로 전송되었습니다.",
        status: "success",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    } catch (e) {
      console.error("이메일 인증 중 오류 발생:", e);

      // 인증 요청 메일 발송 실패 시 토스트 알람 표시
      toast({
        title: "이메일 인증 요청을 보내는 중 오류가 발생했습니다.",
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
    }
  };

  // 3. 인증번호 인증을 진행한다.
  const fetchCheckEmailCode = async () => {
    try {
      const res = await Api.post(`/auth/verify`, { email, code: verificationCode });
      if (res.status === 200) {
        setSuccededEmailCode(true);
        toast({
          title: `이메일 인증 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      toast({
        title: `이메일 인증 실패!`,
        status: "error",
        isClosable: true,
        duration: TOAST_TIMEOUT_INTERVAL,
      });
      setSuccededEmailCode(false);
    }
  };

  // 4. 회원가입을 진행한다.
  const fetchRegister = async () => {
    try {
      const res = await Api.post("/auth/signup", { name, email, password });
      if (res.status === 201) {
        toast({
          title: `회원가입이 완료되었습니다.`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        setTimeout(() => {
          navigate("/login");
        }, TOAST_TIMEOUT_INTERVAL + 100);
      } else {
        toast({
          title: `회원가입도중 오류가 발생했습니다..`,
          status: "error",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isNameValid = name.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === confirmPassword;
  const isVerificationCodeValid = verificationCode.length > 0;

  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isPasswordSame && isVerificationCodeValid;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserInfo({
      ...newUserInfo,
      [name]: value,
    });
  };

  const navigateToIntroPage = () => {
    navigate("/");
  };

  useEffect(() => {
    if (debounceFetchTerm) {
      fetchEmailCheck();
    }
  }, [debounceFetchTerm]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.100", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            워디 회원가입!
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            AI와 함께 쉽게 배우는 영단어✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <Box w="360px">
              <FormControl id="firstName" isRequired>
                <FormLabel>이름</FormLabel>
                <Input type="text" name="name" value={name} onChange={handleChange} />
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="email" isRequired>
                <FormLabel>이메일</FormLabel>
                {email.length !== 0 && (
                  <Text
                    position="absolute"
                    right="24px"
                    bottom="10px"
                    fontSize="xs"
                    color={isEmailAvailable ? "teal.500" : "tomato"}
                  >
                    {getEmailStatus()}
                  </Text>
                )}

                <Input name="email" type="email" value={email} onChange={handleChange} />
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="code" isRequired>
                <FormLabel>인증번호</FormLabel>
                <Input
                  type="text"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={handleChange}
                />
                <Box position="absolute" right="0" top="45%">
                  {!succededEmailCode ? (
                    <Button
                      fontSize={"sm"}
                      border={"none"}
                      bg={"none"}
                      onClick={!sendEmailCodeClick ? fetchSendEmailCode : fetchCheckEmailCode}
                    >
                      {!sendEmailCodeClick ? "인증번호 전송" : "확인"}
                    </Button>
                  ) : (
                    <Button
                      fontSize={"sm"}
                      border={"none"}
                      bg={"none"}
                      disabled={true}
                      color={"teal.500"}
                    >
                      인증완료
                    </Button>
                  )}
                </Box>
              </FormControl>
            </Box>

            <Box w="360px">
              <FormControl id="password" isRequired>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={password}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
            <Box w="360px">
              <FormControl id="password_confirm" isRequired>
                <FormLabel>비밀번호 확인</FormLabel>
                <InputGroup>
                  <Input
                    value={confirmPassword}
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                colorScheme="teal"
                color={"white"}
                onClick={fetchRegister}
              >
                회원가입
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                이미 회원이신가요?{" "}
                <ChakraLink as={ReactRouterLink} color={"teal.400"} to="/login">
                  로그인
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUp;
