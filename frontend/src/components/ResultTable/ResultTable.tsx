import { Box, Table } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { ResultTableProgress } from "@components/ResultTableProgress/ResultTableProgress";
import TestResultScore from "@models/TestResultScore";
import TestResultStats from "@models/TestResultStats";
import style from "./ResultTable.module.css";

class ResultTableProps {
  data: TestResultScore[];
  statData: TestResultStats;

  constructor(data: TestResultScore[], statData: TestResultStats) {
    this.data = data;
    this.statData = statData;
  }
}

export function ResultTable(props: ResultTableProps) {
  if (!props.data || props.data.length === 0) {
    return (
      <>
        <Box
          h={400}
          style={{
            textAlign: "center",
            lineHeight: "400px",
          }}
        >
          No data
        </Box>
      </>
    );
  }

  let maxTotalScore = 0;
  if (props.statData.max_total_score !== undefined) {
    maxTotalScore = props.statData.max_total_score;
  }

  let maxContextLengthScore = 0;
  if (props.statData.max_context_length !== undefined) {
    maxContextLengthScore = props.statData.max_context_length;
  }

  let maxReasoningDepthScore = 0;
  if (props.statData.max_reasoning_depth !== undefined) {
    maxReasoningDepthScore = props.statData.max_reasoning_depth;
  }

  let maxInstructionComplianceScore = 0;
  if (props.statData.max_instruction_compliance !== undefined) {
    maxInstructionComplianceScore = props.statData.max_instruction_compliance;
  }

  const items: TestResultScore[] = props.data;

  return (
    <div className={style.resultContainer}>
      <div className={style.resultTable}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={style.resultTableFistTh}>Model</Table.Th>
              <Table.Th>Total Score</Table.Th>
              <Table.Th>Context Length</Table.Th>
              <Table.Th>Reasoning Depth</Table.Th>
              <Table.Th>Instruction Compliance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item: TestResultScore) => (
              <Table.Tr key={randomId()}>
                <Table.Td className={style.resultTableFistTd}>
                  {item.llm_id}
                </Table.Td>
                <Table.Td className={style.resultTableTd}>
                  <ResultTableProgress
                    value={item.total_score}
                    maxValue={maxTotalScore}
                  />
                </Table.Td>
                <Table.Td className={style.resultTableTd}>
                  <ResultTableProgress
                    value={item.aggregated_scores?.context_length}
                    maxValue={maxContextLengthScore}
                  />
                </Table.Td>
                <Table.Td className={style.resultTableTd}>
                  <ResultTableProgress
                    value={item.aggregated_scores?.reasoning_depth}
                    maxValue={maxReasoningDepthScore}
                  />
                </Table.Td>
                <Table.Td className={style.resultTableLastTd}>
                  <ResultTableProgress
                    value={item.aggregated_scores?.instruction_compliance}
                    maxValue={maxInstructionComplianceScore}
                  />
                </Table.Td>
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
          {items.map((item: TestResultScore) => (
            <Table.Tr key={randomId()}>
              <Table.Td className={style.resultTableFistTd}>
                {item.llm_id}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
