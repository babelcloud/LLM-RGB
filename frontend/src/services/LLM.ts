import LLM from '@models/LLM';
import LLMConfig from '@models/LLMConfig';

import gpt4 from '@components/assets/gpt4.png';
import gpt35 from '@components/assets/gpt35.png';
import llama2 from '@components/assets/llama2.png';
import claude2 from '@components/assets/claude2.jpg';
import chatglm from '@components/assets/chatglm.png';
import minimax from '@components/assets/minimax.png';
import cohere from '@components/assets/cohere.png';
import palm2 from '@components/assets/palm2.png';
import aliqwen from '@components/assets/aliqwen.png';
import baichuan2 from '@components/assets/baichuan2.png';
import baidu from '@components/assets/baidu.png';
import moonshot from '@components/assets/moonshot.png';
import sensenova from '@components/assets/sensenova.png';
import hunyuan from '@components/assets/hunyuan.png';
import robot from '@components/assets/robot.png';

export function getLLMs(): LLM[] {
  return [
    new LLM('openai:gpt-4-0613', 'gpt-4', 'GPT-4', gpt4, new LLMConfig('', 0)),
    new LLM('openai:gpt-3.5-turbo-16k-0613', 'gpt-3.5', 'GPT-3.5', gpt35, new LLMConfig('', 0)),
    new LLM(
      'replicate:meta/llama-2-70b-chat:35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287',
      'llama2-70b-v2-chat',
      'Llama2',
      llama2,
      new LLMConfig('', 0.01, 4096),
      '(replicate.com)'
    ),
    new LLM('anthropic:completion:claude-2', 'claude2', 'Claude2', claude2, new LLMConfig('')),
    new LLM(
      'webhook:https://llm-proxy.babel.run/chatglm',
      'chatglm',
      'ChatGLM',
      chatglm,
      new LLMConfig('')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/minimax',
      'minimax',
      'MINIMAX',
      minimax,
      new LLMConfig('', undefined, undefined, '')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/cohere',
      'cohere',
      'Cohere',
      cohere,
      new LLMConfig('')
    ),
    new LLM(
      'palm:chat-bison-001',
      'palm2',
      'Palm2',
      palm2,
      new LLMConfig('', 0.01)
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/aliqwen',
      'aliqwen',
      'Aliqwen',
      aliqwen,
      new LLMConfig('')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/baichuan',
      'baichuan2',
      'Baichuan',
      baichuan2,
      new LLMConfig('', undefined, undefined, undefined, undefined, '')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/baidu-erniebot',
      'baidu',
      'Baidu',
      baidu,
      new LLMConfig('', undefined, undefined, undefined, undefined, '')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/moonshot',
      'moonshot',
      'Moonshot',
      moonshot,
      new LLMConfig('')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/sensenova',
      'sensenova',
      'SenseNova',
      sensenova,
      new LLMConfig('', undefined, undefined, undefined, undefined, '')
    ),
    new LLM(
      'webhook:https://llm-proxy.babel.run/hunyuan',
      'hunyuan',
      'HunYuan',
      hunyuan,
      new LLMConfig(undefined, undefined, undefined, undefined, undefined, undefined, '', '', '')
    ),
    new LLM(
      'custom',
      'custom',
      'Custom',
      robot,
      new LLMConfig(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '', '', '')
    ),
  ];
}
