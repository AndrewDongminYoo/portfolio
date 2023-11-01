import aws from '@/public/svg/stacks/aws-lambda.svg';
import expo from '@/public/svg/stacks/expo.svg';
import flask from '@/public/svg/stacks/flask.svg';
import flutter from '@/public/svg/stacks/flutter.svg';
import nextjs from '@/public/svg/stacks/nextjs.svg';
import openai from '@/public/svg/stacks/openai.svg';
import reactnative from '@/public/svg/stacks/react-native.svg';
import rn_firebase from '@/public/svg/stacks/react-native-firebase.svg';
import selenium from '@/public/svg/stacks/selenium.svg';
import spring from '@/public/svg/stacks/spring.svg';
import swagger from '@/public/svg/stacks/swagger.svg';
import typescript from '@/public/svg/stacks/typescript-icon.svg';
import webpack from '@/public/svg/stacks/webpack.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frameworks: Record<string, any> = {
  '52market.front': webpack,
  '52market.shop': swagger,
  'AndrewDongminYoo.vercel': nextjs,
  'do-it-react-native-clone': typescript,
  'flask-My-Small-Meal': flask,
  'flutter-proxy-voting-app': flutter,
  'my-first-react-native-chatting-app': expo,
  'openai-chatgpt-my-conversations': openai,
  'react-native-step-counter': reactnative,
  'Serverless-Framework-Crawlers': aws,
  'TIL-of-BootCamp-Flask': selenium,
  'TIL-of-BootCamp-Spring': spring,
  walking_tracker: rn_firebase,
  wegooliFriendApp: flutter,
};

export default frameworks;
