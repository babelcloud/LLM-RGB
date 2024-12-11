import { Box, Text, Image } from "@mantine/core";
import { Fragment } from "react";
import LLM from "@models/LLM";
import style from "./LLMIcon.module.css";

export class LLMIconProps {
  key: string;
  data: LLM;
  public enable?: boolean = true;
  onClick: (enable: boolean, data: LLM) => void;

  constructor(
    key: string,
    data: LLM,
    onClick: (enable: boolean, data: LLM) => void,
    enable?: boolean,
  ) {
    this.key = key;
    this.data = data;
    this.enable = enable === undefined ? false : enable;
    this.onClick = onClick;
  }
}

export function LLMIcon(props: LLMIconProps) {
  const { data, enable, onClick } = props;

  return (
    <Fragment key={props.data.key}>
      <Box
        className={enable ? style.frameEnable : style.frameDisable}
        onClick={() => {
          onClick(!enable, data);
        }}
      >
        <Image w={40} h={40} className={style.displayInline} src={data.icon} />
        <Text className={style.frameLabel} mt={8}>
          {data.name}
        </Text>
      </Box>
    </Fragment>
  );
}
