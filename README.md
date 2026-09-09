# 202230126 이주환
1. 이름 학번 h1 제일 위에 기재
2. 날짜(주차)
3. 배운내용 & 코드
4. 최근 날짜가 제일 위로 올라오게

## 20260909(2주차)
* app 디렉토리 생성 - layout.tsx 파일 생성(루트 레이아웃, html and body tag 추가)
```
export default function RootLayout({children} : {children: React.ReactNode}) {
    return (<html lang="en"><body>{children}<body></html>);
}
```
* 초기 콘텐츠로 사용할 홈페이지 "app/page.tsx" 생성
* 사용자가 애플리케이션의 루트를 방문하면 page, layout 두 문서 모두 렌더링 됨
* 타입스크립트 환경에서 리액트와 리액트돔을 사용할 수 있도록 타입 정의 제공하는 패키치 설치해야함 pnpm add -D @types/react @types/react-dom, npm install -D @types/react @types/react-dom
* 일반 설치는 실제 서비스 구동에 반드시 필요한 패키지이고 -D는 개발용이라 코드 빌드, 테스트, 린팅 등 개발할 때만 필요한 패키지
* 프로젝트 루트에 있는 src 폴덜를 사용하여 애플리케이션 코드와 구성 파일을 분리할 수 있다
* 루트 레이아웃을 만드는 것을 잊어버린 경우 Next,js에서 개발 서버를 실행할 때 자동으로 빌드 됨
* 정적 리소스를 저장하기 위한 퍼블릭 디렉토리를 프로젝트 루트에 생성
* 퍼블릭 디렉토리를 생성하면 기본 URL로 퍼블릭 디렉토리 내부의 리소스를 참조할 수 있음
```
import Image from 'next/profile'

export default function Page(){
    return <Image src="/profile.png" alt="profile" width=(100) height(100) />
}
```
* 

## 20260902(1주차)
* project structue, layout and pages, linking and navigating, server and client components, fetching data, css, image optimization, font optimization, deploying
* Next.js는 풀스텍 웹 애플리케이션 구축을 위한 React 프레임워크입니다
* 프레임워크의 프레임워크를 메타 프레임워크라고 함
* React 컴포넌트를 사용하여 사용자 인터페이스를 구축하고 Next.js를 사용하여 추가 기능 및 최적화를 구현함
* Getting Started, Guides, API Refernce 등등 문서가 있음
* App Router and Page Router 앱은 서버 컴포넌트처럼 새로운 리액트 기능을 지원하는 최신 라우터고 페이지는 초기 라우터로 현재도 지원되고 개선되는 중
* pnpm은 performant(효율적인) NPM 약자로 고성능 node 패키지 매니저임, npm, yarn과 같은 목적의 패키지 관리자이지만, 디스크 공간 낭비 / 복잡한 의존성 관리 / 느린 설치 속도 문제 개선을 위해 개발됨 특징은 하드링크(공간), 빠른 패키치 설치 속도, 효율적인 종속성 관리
* pnpm create next-app@latest, 서버 실행 pnpm dev
* pnpm create react-app name, rm -rf node_modules package-lock-json, pnpm install, pnpm dev
* hard link vs symbolic link
* 하드 링크 : 우리가 파일이라고 부르는 것은 세 부분으로 나뉘어 있음 Directory Entry(파일 이름과 해당 inode 번호를 매핑 정보가 있는 특수 파일), inode(파일 또는 디렉토리에 대한 모든 메타데이터를 저장하는 구조체(권한, 소유자, 크기, 데이터 블록 위치)), data blocks(실제 데이터가 존재하는 영역), 하드링크가 생성하면 디렉토리 엔트리에 매핑 정보가 추가되어 동일한 inode를 가리킴, 원본과 하드링크는 완전히 동일한 파일, 원본과 사본 개념이 아님
* 디렉토리 엔트리에 있는 원본과 하드링크는 같은 inode를 참조하므로 데이터 블록을 100% 공유함 따라서 원본이나 하드링크 중에서 하나만 삭제하면 디렉토리 엔트리에서 이름만 삭제됨 link count가 0이 되지 않는 한 데이터는 남아있음 pnpm store에 저장된 패키지나 node.modules/ pnpm에 저장된 패키지나 동일한 파일을 참조하고 있음 pnpm으로 패키지를 설치하면 전역 store에 한 번만 저장됨
* 심볼릭 링크(소프트 링크) inode를 공유하지 않고 경로 문자열을 저장해 두는 특수 파일 따라서 심볼릭 링크를 열면 내부에 적힌 경로를 따라가서 원본 파일을 찾음 원본이 삭제되면 심볼릭 링크는 끊어진 경로가 되므로 더 이상 사용할 수 없음
* Hydration 오류는 보통 SSR(서버 사이드 렌더링)을 할때 서버에서 렌더링된 HTML과 클라이언트에서 렌더링된 HTML이 불일칠할 때 발생함, 동적데이터, 브라우저 전용 API 사용 ,HTML 구조 오류 등등
* 에러 메세지에 힌트가 있음
* 폴리필 구성.