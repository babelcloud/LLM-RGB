import { Box, Text, Image } from '@mantine/core';
import LLM from '@models/LLM';
import { maskKey } from '@services/LLMConfigService';
import style from './LLMItemConfig.module.css';

class LLMItemConfigProps {
  data: LLM;

  constructor(data: LLM) {
    this.data = data;
  }
}

export function LLMItemConfig(props: LLMItemConfigProps) {
  const { data } = props;

  return (
    <>
      <Box key={data.key} className={data.config?.remark ? style.item2 : style.item}>
        <Image
          w={40}
          h={40}
          src={data.icon}
          className={`${style.displayInline} ${data.config?.remark ? '' : style.textMiddle}`}
        />
        {data.config?.remark ? (
          <Box ml={16} className={style.itemBoxText}>
            <Text span className={style.itemBoxTextTitle}>
              {data.name}
            </Text>
            <Text className={style.itemBoxTextSub}>{data.config?.remark}</Text>
          </Box>
        ) : (
          <Text ml={16} className={style.itemText}>
            {data.name}
          </Text>
        )}
        <Box className={style.infoBox}>
          {typeof data.config.apiKey === 'string' ? <Text>{maskKey(data.config.apiKey)}</Text> : ''}
          {data.config.temperature !== undefined ? (
            <Text>Temperature: {data.config.temperature}</Text>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </>
  );
}
