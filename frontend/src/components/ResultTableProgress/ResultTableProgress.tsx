import { Text, Progress } from "@mantine/core";
import { useLayoutEffect, useRef, useState } from "react";
import style from "./ResultTableProgress.module.css";

class ResultTableProgressProps {
  value?: number = 0;
  maxValue?: number = 0;

  constructor(value?: number, maxValue?: number) {
    if (value) {
      this.value = value;
    }
    if (maxValue) {
      this.maxValue = maxValue;
    }
  }
}

export function ResultTableProgress(props: ResultTableProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  const value = props.value ?? 0;
  const maxValue = props.maxValue ?? 0;

  // 颜色配置
  const percentage = Math.round((value / maxValue) * 100);
  let colorValue = "#1F5F4B";
  if (percentage < 30) {
    colorValue = "#991B1B";
  } else if (percentage < 60) {
    colorValue = "#8a7c37";
  }

  return (
    <>
      <Progress.Root className={style.resultTableProgress} size="1.5rem">
        <Progress.Section
          ref={ref}
          className={style.resultTableProgressSection}
          color={colorValue}
          value={percentage}
          style={{
            justifyContent: width < 55 ? "initial" : "end",
          }}
        >
          <Progress.Label className={style.resultTableProgressLabel}>
            {value}
          </Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <Text className={style.resultTableValue}>{value}</Text>
    </>
  );
}
