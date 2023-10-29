import { useState, useEffect } from "react";
import NoteListBox from "./Components/NoteListBox";
import {
  useColorModeValue,
  Flex,
  Spacer,
  Box,
  Heading,
  Badge,
  SimpleGrid,
  AbsoluteCenter,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { getCustomNotes, postCustomNote } from "../../apis/customWord";
import Btn from "../../components/Btn";

const NOTE_LIST = [
  { id: "correct", title: "학습한 단어" },
  { id: "incorrect", title: "틀린 단어" },
];
const TOAST_TIMEOUT_INTERVAL = 800;

/** 유저가 저장한 단어장 목록을 보여주는 페이지입니다. */
export default function CustomNoteListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [noteList, setNoteList] = useState(NOTE_LIST);
  const [customNoteList, setCustomNoteList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);

  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState();

  /** 노트 목록 가져오기 */
  async function fetchNoteList() {
    const res = await getCustomNotes();
    console.log("------노트 목록 -----");
    console.log(res.data);
    setCustomNoteList(res.data);
  }

  /** 타이틀 저장시 유저 커스텀 단어장 생성 */
  const fetchNewCustomNote = async () => {
    const data = { title: title };
    try {
      const res = await postCustomNote(data);
      if (res.status === 201) {
        console.log("단어장 생성");
        console.log(res);
        setTitle(res.data.title);
        setNoteId(res.data.id);
        navigate(`/main/note_add/${noteId}`);
        toast({
          title: `단어장 생성완료!`,
          status: "success",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      } else if (res.status === 400) {
        toast({
          title: `잘못된 요청입니다.`,
          status: "error",
          isClosable: true,
          duration: TOAST_TIMEOUT_INTERVAL,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNoteList();
  }, []);
  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="5">
        <Box p="2">
          <Heading size="md">내 단어장</Heading>
        </Box>
        <Spacer />
        {isEditing ? (
          <ButtonGroup>
            <Btn
              text="전체 삭제"
              colorScheme="red"
              onClick={() => {
                `전체삭제 api`;
              }}
            />
            <Btn text="단어장 저장" onClick={() => setIsEditing((prev) => !prev)} />
          </ButtonGroup>
        ) : (
          <Btn
            text={isEditing ? "단어장 저장" : "단어장 편집"}
            onClick={() => setIsEditing((prev) => !prev)}
          />
        )}
      </Flex>

      <SimpleGrid columns={4} spacing={10}>
        {/* <Link to={`/main/note_add/${noteId}`} onClick={fetchNewCustomNote}> */}
        <Box
          rounded={"lg"}
          bg={useColorModeValue("gray100", "gray.700")}
          boxShadow={"lg"}
          p={8}
          position="relative"
          h="120px"
          borderWidth="3px"
          borderRadius="lg"
          onClick={fetchNewCustomNote}
        >
          <AbsoluteCenter>
            <Badge
              borderRadius="full"
              px="5"
              colorScheme="teal"
              fontSize="lg"
              letterSpacing="center"
            >
              ✚ 새 단어장
            </Badge>
          </AbsoluteCenter>
        </Box>
        {/* </Link> */}

        <NoteListBox noteList={noteList} isEditing={isEditing} />
        <NoteListBox noteList={customNoteList} isEditing={isEditing} />
      </SimpleGrid>
    </>
  );
}
