import { Box, Text, Image, Button, Modal, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useDisclosure, useListState } from '@mantine/hooks';
import { IconMinus, IconSettings2 } from '@tabler/icons-react';
import dayjs from 'dayjs';
import LLM from '@models/LLM';
import { LLMConfigService, maskKey } from '@services/LLMConfigService';
import LLMConfig from '@models/LLMConfig';
import style from './LLMItem.module.css';

export interface onUpdate {
  (arg0: LLMConfig): void;
}

class LLMItemProps {
  data: LLM;
  disable: boolean;
  onUpdate: onUpdate;
  onDelete: Function;
  warning: boolean = false;

  constructor(
    data: LLM,
    disable: boolean,
    onUpdate: onUpdate,
    onDelete: Function,
    warning?: boolean
  ) {
    this.data = data;
    this.disable = disable;
    this.onUpdate = onUpdate;
    this.onDelete = onDelete;
    if (warning !== undefined) {
      this.warning = warning;
    }
  }
}

export function LLMItem(props: LLMItemProps) {
  const { data, disable, onUpdate, onDelete } = props;
  const [listOpened, { open: openList, close: closeList }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const configService = new LLMConfigService();
  const [configList, setConfigList] = useListState(configService.get(data.id));

  const initialValues = {
    apiKey: data.config.apiKey,
    temperature: data.config.temperature,
    max_new_tokens: data.config.max_new_tokens,
    groupId: data.config.groupId,
    maxOutputTokens: data.config.maxOutputTokens,
    secretKey: data.config.secretKey,
    id: data.config.id,
    url: data.config.url,
    config: data.config.config,
    remark: data.config.remark,
  };
  const form = useForm({
    initialValues,
  });

  function add() {
    form.reset();
    openEdit();
  }

  function useIt(config: LLMConfig) {
    Object.assign(data.config, config);
    onUpdate(data.config);
    closeList();
  }

  function del(config: LLMConfig) {
    configService.delete(data.id, config);
    setConfigList.filter((c) => c.created !== config.created);
    console.log(configService.get(data.id));
  }

  function cancelEdit() {
    form.reset();
    closeEdit();
  }

  function save() {
    const config = new LLMConfig(
        form.values.apiKey === null ? undefined : form.values.apiKey,
        form.values.temperature === null ? undefined : form.values.temperature,
        form.values.max_new_tokens === null ? undefined : form.values.max_new_tokens,
        form.values.groupId === null ? undefined : form.values.groupId,
        form.values.maxOutputTokens === null ? undefined : form.values.maxOutputTokens,
        form.values.secretKey === null ? undefined : form.values.secretKey,
        form.values.id === null ? undefined : form.values.id,
        form.values.url === null ? undefined : form.values.url,
        form.values.config === null ? undefined : form.values.config,
        form.values.remark === null ? undefined : form.values.remark,
    );
    configService.add(data.id, config);
    setConfigList.append(config);
    closeEdit();
    form.reset();
  }

  return (
    <>
      <Box
        key={data.key}
        className={`${data.config?.remark ? style.item2 : style.item} ${
          props.warning ? style.warning : ''
        }`}
      >
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
          <Text span ml={16} className={style.itemText}>
            {data.name}
          </Text>
        )}
        <Button.Group pt={6} className={style.floatRight}>
          <Modal
            className={style.styleModal}
            opened={listOpened}
            onClose={closeList}
            centered
            title=""
          >
            <Image
              w={40}
              h={40}
              src={data.icon}
              className={`${style.displayInline} ${style.textMiddle}`}
            />
            <Text span ml={16} className={style.itemText}>
              {data.name}
            </Text>
            <Box mt={28} className={style.llmForm}>
              {configList.length > 0 ? (
                <>
                  <Text>Used configurations</Text>
                  <Box className={style.configList}>
                    {configList.map((config) => (
                      <Box
                        key={randomId()}
                        mb={12}
                        style={{
                          background:
                            'linear-gradient(0deg, #1E232B, #1E232B), linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06))',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          height: '64px',
                          border: '1px solid #FFFFFF0F',
                        }}
                        onDoubleClick={() => del(config)}
                      >
                        <Button
                          className={style.useIt}
                          color="#F7F9FC14"
                          style={{ float: 'right' }}
                          onClick={() => useIt(config)}
                        >
                          Use it
                        </Button>
                        <Text className={style.configListRow1} style={{ fontSize: '16px' }}>
                          {config.remark} - {dayjs(config.created).format('YYYY-MM-DD HH:mm')}
                        </Text>
                        <Text
                          className={style.configListRow2}
                          style={{
                            color: '#BABBBF',
                            fontSize: '13px',
                          }}
                        >
                          {typeof config.apiKey === 'string' ? maskKey(config.apiKey) : ''}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                ''
              )}
              <Box mt={20}>
                <Button
                  style={{
                    backgroundColor: '#795FF3',
                    width: '100%',
                    borderRadius: '8px',
                  }}
                  onClick={add}
                >
                  Add a new configuration
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            className={style.styleModal}
            opened={editOpened}
            onClose={closeEdit}
            centered
            title=""
          >
            <Image
              w={40}
              h={40}
              src={data.icon}
              className={`${style.displayInline} ${style.textMiddle}`}
            />
            <Text span ml={16} className={style.itemText}>
              {data.name} Configuration {data.note}
            </Text>
            <Box mt={28} className={style.llmForm}>
              <TextInput
                disabled={disable}
                label="Remarks"
                placeholder="Remarks information is optional"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                {...form.getInputProps('remark')}
              />
              {data.config.apiKey !== undefined ? (
                <TextInput
                  disabled={disable}
                  mt={20}
                  label="API Key"
                  placeholder="Please input the API key"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('apiKey')}
                />
              ) : (
                ''
              )}
              {data.config.secretKey !== undefined ? (
                <TextInput
                  disabled={disable}
                  mt={20}
                  label="Secret Key"
                  placeholder="Please input the secret key"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('secretKey')}
                />
              ) : (
                ''
              )}
              {data.config.groupId !== undefined ? (
                <TextInput
                  disabled={disable}
                  mt={20}
                  label="Group ID"
                  placeholder="Please input the group id"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('groupId')}
                />
              ) : (
                ''
              )}
              {data.config.id !== undefined ? (
                <TextInput
                  disabled={disable}
                  mt={20}
                  label="ID"
                  placeholder="Please input the unique model id"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('id')}
                />
              ) : (
                ''
              )}
              {data.config.url !== undefined ? (
                <TextInput
                  disabled={disable}
                  mt={20}
                  label="URL"
                  placeholder="Please input the webhook url"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('url')}
                />
              ) : (
                ''
              )}
              {data.config.config !== undefined ? (
                <Textarea
                  minRows={4}
                  maxRows={8}
                  autosize
                  disabled={disable}
                  mt={20}
                  label="Config"
                  placeholder="Please input the config json"
                  inputWrapperOrder={['label', 'error', 'input', 'description']}
                  {...form.getInputProps('config')}
                />
              ) : (
                ''
              )}
              <Box mt={20} ta="right">
                <Button color="gray" mr={10} onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button disabled={disable} onClick={save}>
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>
          <Button
            className={style.listBtn}
            variant="transparent"
            color="#BABBBF"
            size="2rem"
            onClick={disable ? openEdit : openList}
          >
            <IconSettings2 size={20} />
          </Button>
          {!disable ? (
            <Button
              className={style.listBtn}
              variant="transparent"
              color="#BABBBF"
              size="2rem"
              onClick={() => onDelete()}
            >
              <IconMinus size={20} />
            </Button>
          ) : (
            ''
          )}
        </Button.Group>
        <Box className={style.clearBoth} />
      </Box>
    </>
  );
}
