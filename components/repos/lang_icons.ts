import aws from '@/public/svg/stacks/aws-lambda.svg';
import dart from '@/public/svg/stacks/dart.svg';
import flutter from '@/public/svg/stacks/flutter.svg';
import markdown from '@/public/svg/stacks/markdown.svg';
import mdx from '@/public/svg/stacks/mdx.svg';
import nextjs from '@/public/svg/stacks/nextjs.svg';
import openai from '@/public/svg/stacks/openai.svg';
import reactnative from '@/public/svg/stacks/react-native.svg';
import rn_firebase from '@/public/svg/stacks/react-native-firebase.svg';
import spring from '@/public/svg/stacks/spring.svg';
import swagger from '@/public/svg/stacks/swagger.svg';
import typescript from '@/public/svg/stacks/typescript-icon.svg';
import webpack from '@/public/svg/stacks/webpack.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frameworks: Record<string, any> = {
  '52market.front': webpack,
  '52market.shop': swagger,
  'do-it-react-native-clone': typescript,
  'docs-trunk-io-ko': markdown,
  'react-native-step-counter': reactnative,
  'serverless-crawlers': aws,
  'TIL-of-BootCamp-Spring': spring,
  'walking-tracker': rn_firebase,
  andrewdongminyoo: markdown,
  cash_stepper: flutter,
  chatgpt: openai,
  portfolio: nextjs,
  wegooli_friends: dart,
  wiki: mdx,
};

export default frameworks;
