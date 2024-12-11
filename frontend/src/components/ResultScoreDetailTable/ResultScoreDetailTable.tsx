import { Box, Table } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import TestResultScore from "@models/TestResultScore";
import TestResultStats from "@models/TestResultStats";
import { ResultTableProgress } from "@components/ResultTableProgress/ResultTableProgress";
import style from "./ResultScoreDetailTable.module.css";

class ResultScoreDetailTableProps {
  data: TestResultScore[];
  statData: TestResultStats;

  constructor(data: TestResultScore[], statData: TestResultStats) {
    this.data = data;
    this.statData = statData;
  }
}

export function ResultScoreDetailTable(props: ResultScoreDetailTableProps) {
  if (!props.data || props.data.length === 0) {
    return (
      <>
        <Box h={400} style={{ textAlign: "center", lineHeight: "400px" }}>
          No data
        </Box>
      </>
    );
  }

  const items: TestResultScore[] = props.data;
  const models: string[] = [];
  const scoreNameSet: string[] = [];
  const scoreSet = new Map<string, number[]>();
  items.map((item) => {
    if (item.llm_id === undefined || item.total_score === undefined) {
      return false;
    }
    models.push(item.llm_id);
    const testName = "Total Score";
    if (!scoreSet.has(testName)) {
      scoreSet.set(testName, []);
      scoreNameSet.push(testName);
    }
    scoreSet.get(testName)?.push(item.total_score);
    item.scores?.map((score) => {
      if (!scoreSet.has(score.test_name)) {
        scoreSet.set(score.test_name, []);
        scoreNameSet.push(score.test_name);
      }
      scoreSet.get(score.test_name)?.push(score.test_score);
      return true;
    });
    return true;
  });

  const maxScores = new Map<String, number>();
  maxScores.set("Total Score", props.statData.max_total_score ?? 0);
  props.statData.testcases?.forEach((testcase: any) => {
    maxScores.set(testcase.name, testcase.max_score);
  });

  return (
    <div className={style.resultContainer}>
      <div className={style.resultTable}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th key={randomId()} className={style.resultTableFistTh}>
                Model
              </Table.Th>
              {models.map((item) => (
                <Table.Th key={randomId()}>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {scoreNameSet.map((name) => (
              <Table.Tr key={randomId()}>
                <Table.Td className={style.resultTableFistTd}>{name}</Table.Td>
                {scoreSet.get(name)?.map((value) => (
                  <Table.Td key={randomId()} className={style.resultTableTd}>
                    <ResultTableProgress
                      value={value}
                      maxValue={maxScores.get(name) ?? 0}
                    />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <Table className={style.resultTableFixed}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={style.resultTableFistTh}>Model</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {scoreNameSet.map((name) => (
            <Table.Tr key={randomId()}>
              <Table.Td className={style.resultTableFistTd}>{name}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
