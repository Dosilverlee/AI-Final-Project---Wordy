import React, { useState, useCallback } from "react";
import { Box, Button, Flex, Spinner, Tag, useToast } from "@chakra-ui/react";
import { InputDialogData } from "../../apis/new_gpt_interface";
import { FetchGpt } from "../../apis/new_gpt";
import ScriptDialog from "./components/ScriptDialog";

const TestGptWordPage = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isScriptLoading, setScriptLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState(null);
  const [isGrammarLoading, setGrammarLoading] = useState(false);

  const toast = useToast();

  const wordList = {
    aboard: "배로",
    abort: "중단하다",
    about: "-에 대하여",
    apple: "사과",
    banana: "바나나",
  };

  const handleTagClick = useCallback(
    (word) => {
      const newSelectedWords = selectedWords.includes(word)
        ? selectedWords.filter((w) => w !== word)
        : [...selectedWords, word];
      setSelectedWords(newSelectedWords);
    },
    [selectedWords],
  );

  const handleGetScript = useCallback(async () => {
    console.log("handleGetScript 실행, 현재 selectedWords:", selectedWords);
    setScriptLoading(true);
    try {
      const updatedDialogParams: InputDialogData = {
        line_count: selectedWords.length + 2,
        word_pairs: selectedWords.reduce((obj, word) => {
          return { ...obj, [word]: wordList[word] };
        }, {}),
      };

      console.log("API 호출 전, updatedDialogParams:", updatedDialogParams);
      const apiResult = await FetchGpt.getScript(updatedDialogParams);

      toast({
        title: "Script fetch successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log("API 호출 결과:", apiResult);
      setScriptResult(JSON.stringify(apiResult));
    } catch (error) {
      toast({
        title: "Script fetch failed.",
        description: `Error: ${error.message || error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      console.log("API 호출 실패:", error);
      setScriptResult(`Failed to fetch script: ${error.message || error}`);
    } finally {
      setScriptLoading(false);
    }
  }, [selectedWords, wordList, toast]);

  return (
    <Flex direction="column" align="center" justify="flex-start" height="100vh">
      <Box maxW="sm" p={4} borderWidth={1} borderRadius="lg">
        <Box>
          {Object.keys(wordList).map((word) => (
            <Tag
              key={word}
              size="md"
              variant={selectedWords.includes(word) ? "solid" : "outline"}
              colorScheme="teal"
              m={1}
              onClick={() => handleTagClick(word)}
            >
              {word}
            </Tag>
          ))}
        </Box>
        <Button mt={4} onClick={handleGetScript} isDisabled={isGrammarLoading || isScriptLoading}>
          {isScriptLoading ? <Spinner /> : "대화 생성하기"}
        </Button>
        <Box mt={4} maxW="sm">
          {scriptResult ? (
            <ScriptDialog
              dialogResult={JSON.parse(scriptResult)}
              isGrammarLoading={isGrammarLoading}
              setGrammarLoading={setGrammarLoading}
              isScriptLoading={isScriptLoading}
            />
          ) : null}
        </Box>
      </Box>
    </Flex>
  );
};

export default TestGptWordPage;
