import {
  Flex,
  Box,
  FormControl,
  Input,
  Stack,
  HStack,
  Text,
  Spacer,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { isStringLiteral } from "typescript";
import AddCustomNote from "./Components/AddCustomNote";
import * as type from "../../apis/types/custom";
import {
  postCustomNote,
  putCustomNote,
  postCustomWord,
  putCustomWord,
  getNoteDetail,
  delCustomNote,
} from "../../apis/customWord";
import Btn from "../../components/Btn";
import WordBox from "./Components/WordBox";
import CustomWordBox from "./Components/CustomWordBox";

const TOAST_TIMEOUT_INTERVAL = 700;

// todo 단어장 title input입력시 redirect되는 에러 해결하기
// 생성된 커스텀단어id 값 확인
export default function CustomNoteAddPage() {
  const { note_id } = useParams();
  const navigate = useNavigate();

  const toast = useToast();

  const [disable, setDisable] = useState(false);
  const [isItAdd, setIsItAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [title, setTitle] = useState("");

  const [customWord, setCustomWord] = useState<type.SubmitCustomWord>({
    word: "",
    meaning: "",
  });

  /** 추가한 단어목록 받아오는 애 */
  const [words, setWords] = useState([]);

  const fetchTitle = async () => {
    const data = { id: note_id, title: title };
    try {
      const res = await putCustomNote(data);
      if (res.status === 200) {
        toast({
          title: `변경 완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** 단어추가하는 함수 */
  const fetchWord = async (data) => {
    const res = await postCustomWord(`?`, data); // todo 단어장 id받기
  };

  /** 해당 단어장 목록 가져오는 함수 */
  const fetchWordList = async () => {
    try {
      const url = `customBookId=${note_id}`;
      const res = await getNoteDetail(url);
      setWords(res.data.words);
      console.log(res.data.words);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDelNote = async () => {
    const url = `customBookId=${note_id}`;
    try {
      const res = await delCustomNote(url);
      if (res.status === 200) {
        toast({
          title: `삭제되었습니다.`,
          status: "warning",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
        navigate("/main/notes");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWordList();
  }, []);

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Btn text="단어장 삭제" colorScheme="red" onClick={fetchDelNote} />
        <Spacer />
        <Btn text="단어장 저장" onClick={navigate("/main/notes")} />
      </Flex>
      <Flex
        height={"100%"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} color={"gray.500"}>
              단어 추가하기
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w="360px"
          >
            <FormControl id="custom-book">
              <HStack spacing={2}>
                <Input
                  id="title"
                  type="text"
                  placeholder="단어장 이름"
                  value={title} // ""
                  isDisabled={disable}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <Btn
                  text={isEditing ? `저장` : `수정`}
                  onClick={() => {
                    if (isEditing) fetchTitle();
                    setDisable((prev) => !prev);
                    setIsEditing((prev) => !prev);
                  }}
                />
              </HStack>
            </FormControl>
          </Box>
          <AddCustomNote
            isItAdd={isItAdd}
            setIsItAdd={setIsItAdd}
            customWord={customWord}
            onClick={fetchWord}
          />
          {words.map(() => (
            <CustomWordBox isEditing={isEditing} setIsEditing={setIsEditing} words={words} />
          ))}
        </Stack>
      </Flex>
    </>
  );
}
