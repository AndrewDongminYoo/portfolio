import aws from '@/public/images/stacks/aws-lambda.svg';
import expo from '@/public/images/stacks/expo.svg';
import flask from '@/public/images/stacks/flask.svg';
import flutter from '@/public/images/stacks/flutter.svg';
import markdown from '@/public/images/stacks/markdown.svg';
import nextjs from '@/public/images/stacks/nextjs.svg';
import openai from '@/public/images/stacks/openai.svg';
import reactnative from '@/public/images/stacks/react-native.svg';
import rn_firebase from '@/public/images/stacks/react-native-firebase.svg';
import selenium from '@/public/images/stacks/selenium.svg';
import spring from '@/public/images/stacks/spring.svg';
import swagger from '@/public/images/stacks/swagger.svg';
import typescript from '@/public/images/stacks/typescript-icon.svg';
import webpack from '@/public/images/stacks/webpack.svg';

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
    AndrewDongminYoo: markdown,
};

export default frameworks;
