---
index:  220515
title: '주식회사비사이드코리아 백엔드/모바일개발자'
name: '비사이드코리아 개발자'
role: '백엔드/모바일 개발자'
startAt: '2022-05-15'
endAt: '2022-11-15'
website_url: 'https://bside.ai/'
icon: 'url(https://icon.horse/icon/www.bside.ai)'
duration: 7
tags:
  - 'Flutter'
  - 'TypeScript'
  - 'GraphQL'
  - 'Prisma'
  - 'Storybook'
  - 'ReactJS'
  - 'Python'
  - 'AWS Lambda'
description:
  - '비사이드 코리아는 소액주주들이 투자한 기업에 대해 전문투자기관들과 함께 심도 깊은 의견을 나누고 유용한 정보를 공유 하고 의견을 집결해 행동할 수 있는 플랫폼입니다.'
  - '비사이드 코리아가 구축하고자 하는 "주주인증, 결집 및 실행이 가능한 주주 행동주의 플랫폼"를 구성하는 핵심 서비스중 하나인 모바일 앱 개발에 참여했습니다.'
  - '주주총회 기간에는 전자위임 기능에 집중하고, 비시즌에는 MTS 스크래이핑 기능으로 주주의 보유 주식을 자동 인증하고, 라운지로 결집시켜 포털화해 전자위임으로 행동하도록 했습니다.'
projects:
  - title: '국내주식시장 의결권 위임 (전자서명) 크로스플랫폼 앱 개발'
    startAt: '2022-05-15'
    endAt: '2022-08-15'
    repository: 'https://github.com/AndrewDongminYoo/flutter-proxy-voting-app'
    website_url: 'https://bside.page.link/download'
    icon: 'url(https://icon.horse/icon/www.bside.ai)'
    description:
      - 플러터를 사용해 소액주주들에게 캠페인 진행 특정 주식의 의결권을 전자서명으로 위임받아, 주주들의 의견을 집결해 자산운용사가 주주총회까지 전달하는 서비스를 하였습니다.
      - 플러터의 머터리얼 UI와 공식 패키지들을 사용해 메인 컴포넌트를 꾸미고, 의결권 위임을 위해 주민등록증 촬영, 전자 서명 저장, 투표 등을 구현했습니다.
      - 이후에는 외부 업체의 스크래핑 모듈, 공인인증서 모듈과의 연동을 위해 코틀린(Android Studio), 스위프트(X Code) 코드를 작성해 네이티브 공통기능도 개발하였습니다.
  - title: '비사이드코리아 웹페이지 개발'
    startAt: '2022-09-15'
    endAt: '2022-10-15'
    repository: 'https://github.com/orgs/bsidekr/repositories'
    website_url: 'https://bside.ai/'
    icon: 'url(https://icon.horse/icon/www.bside.ai)'
    description:
      - React, GraphQL, Prisma를 기반으로 구축된 풀스택 멀티클라이언트 JavaScript 프레임워크인 RedWoodJS를 이용해 풀스택 전반 개발했습니다.
      - 스캐폴드 스토리북 코드와 테스트 코드로 간단한 아토믹 컴포넌트나 레이아웃부터 AWS SMTP 서비스와 연결된 어드민 메일 기능 등의 백엔드까지 개발했습니다.
  - title: '연계된 자산운용사들을 위한 크롤러 개발'
    startAt: '2022-10-15'
    endAt: '2022-11-15'
    repository: 'https://github.com/AndrewDongminYoo/Serverless-Framework-Crawlers'
    website_url: 'https://www.notion.so/donminzzi/ffbbc8f0c92841b885a939a65681a177'
    icon: 'url(https://icon.horse/icon/www.bside.ai)'
    description:
      - Serverless Framework를 활용해 AWS Lambda 컨테이너에서 cron 스케줄 이벤트로 스크래핑을 실행하는 함수를 배포했습니다.
      - S3버킷에서 타겟을 불러와 읽고 REST API Fetching을 시도하고, 실패 시 automate web browser interaction을 진행, 수집한 데이터를 pandas로 정리해 람다 컨테이너의 EFS 또는 S3 버킷에 파일을 저장하는 동작.