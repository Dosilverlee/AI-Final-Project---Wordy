import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ListItem, OrderedList, Spinner } from "@chakra-ui/react";
import RankList from "./ListItem";

import * as Api from "../apis/api";

const USER_RANK = [
  { id: 1, nickname: "진채영짱짱맨", score: 97 },
  { id: 2, nickname: "진채영최강맨", score: 99 },
  { id: 3, nickname: "지존채영", score: 98 },
  { id: 4, nickname: "최강채영", score: 100 },
];

export default function RankFeild() {
  const [loading, setLoading] = useState(false);
  const [usersRank, setUsersRank] = useState([]);

  const fetchUserRanks = async () => {
    setLoading(true);
    const res = await Api.get("/rank");
    const data = res?.data;
    if (Array.isArray(data)) {
      setUsersRank(data);
    } else {
      setUsersRank([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserRanks();
  }, []);

  if (loading)
    return (
      <StyledLoading>
        <Spinner size="lg" color="blue.500" className="loading" />;
      </StyledLoading>
    );

  return <RankList rankList={USER_RANK} />;
}

const StyledLoading = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
