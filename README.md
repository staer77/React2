# 202230126 이주환
1. 이름 학번 h1 제일 위에 기재
2. 날짜(주차)
3. 배운내용 & 코드
4. 최근 날짜가 제일 위로 올라오게

## 20260916(3주차)
* Route Groups and private folders
 - 라우트 그룹을 사용하여 URL을 변경하지 않고 코드를 정리할 수 있습니다
 - 라우팅되지 않는 파일들은 _folder라는 비공개 디렉토리에 함께 저장합니다

* Parallel(병렬) and intercepted Routes
 - 이러한 기능은 슬롯 기반 레이아웃이나 모달 라우팅과 같은 특정 UI 패턴에 적합합니다
 - 부모 레이아웃에서 렌더링되는 named slots에는 @slot을 사용합니다
 - intercepte pattern을 사용하면 URL을 변경하지 않고도 레이아웃 내에서 다른 경로를 렌더링 할 수 있음

* Metadata file conventions
* Open Graph and Twitter images

* Open Graph Protocol : 링크를 전달할 때 미리보기를 생성하는 프로토콜, META가 주도하는 표준화 규칙

* Organizing your project
 - Next.js는 프로젝트 파일을 어떻게 구성하고 어디에 배치할지에 대한 제약이 없음
 - 프로젝트를 체계적으로 구성하는데 도움이 되는 몇 가지 기능을 제공
* Component hierarchy : 특수 파일에 정의된 컴포넌트는 특정 계층 구조를 렌더링 함
 - 리액트 오류 경계, 리액트 서스팬스 경계, 중첩 layout.js

* layout와 template 차이점 : 정적과 동적

* Colocation : 파일 및 폴더를 기능 별로 그룹화해서 프로젝트의 구조를 명확하게 정의하는 것
 - app 디렉토리에서 중첩된 폴더는 라우팅 구조를 정의함
 - 각 폴더는 URL의 해당 세그먼트에 맵핑되는 라우팅 세그먼트를 나타냄
 - 라우트 구조가 정의되도 해당 라루트 세그먼트에 page파일 또는 라우트파일이 추가되기 전까지는 외부에서 해당 라우트에 접근할 수 있음

* private folders
* 라우팅 그룹은 다음과 같은 경우에 유용함
 - 사이트 섹션, 목적 또는 팀별로 라우트를 구성함
 - 동일한 라우팅 세그먼트 수준에서 중첩 레이아웃을 활성화

* pnpm create next-app@latest

* 레이아웃의 기본 구성
 - children -> 라우트 전환 시 해당 페이지나 하위 레이아웃이 들어오는 자리
 - matadata -> SEO 정보(title, description 등)을 Next.js가 자동으로 head에 삽입
 - app/(group)/layout.tsx -> 특정 그룹/폴더 전용 레이아웃

* Opting for loading skeletons on a specific route
 - 로딩js 파일을 통해 특정 라우트 폴더에 로딩 스켈레톤을 적용하려면 새 라우팅 그룹을 만든 다음 해당 라우팅 그룹 내부로 로딩tsx를 이동함

* Layouts and pages
 - Creating a page
 - Creating a layout
 * 레이아웃은 여러 페이지에서 공유 되는 UI, 네비게이션에서 state 및 상호작용을 유지하며 다시 렌더링 되지 않음

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
* https://nextjs.org/docs/app/api-reference/config/typescript
* /src 디렉토리 사용 추천 코드와 설정 파일을 분리
* .mjs는 module JavaScript의미함, .eslintrc.json은 정적인 설정 파일, exlint.config.mjs는 동적인 설정도 가능
* 라우팅은 경로를 찾아가는 과정을 의미하며 path도 경로로 번역하기 때문에 구별을 위해 대부분 라우팅으로 번역함
* 최상위 폴더는 디렉토리로 하위 폴더는 folder로 쓰는 경우가 있음
* segment는 라우팅과 관련이 있는 디렉토리의 별칭 정도임
* 앱 라우터, 페이지 라우터, public 제공될 정적 리소스, src
* Folder and file conventions : 최상위 파일은 애플리케이션 구성, 종속성 관리, 프록시 실행, 모니터링 도구 통합, 환경 변수 정의에 사용함
* 라우팅 파일 : 경로를 노출할 페이지를 추가하고 헤더, 네비게이션, 푸터와 같은 공유 UI 레이아웃을 추가 할 수 있음 이 밖에 skeletons 로딩 화면을 추가하고 오류 경계를 표시하는 오류화면을 추가하고 API 경로를 추가할 수 있음
* Nested routes : 디렉토리는 URL segments를 정의함 디렉토리를 중첩하면 세그먼트도 중첩됨 모든 수준의 레이아웃은 하위 세그먼트를 감쌈 페이지나 경로 파일이 존재하면 해당 경로는 공개됨
* Dynamic routes : 대괄호를 사용하여 새그먼트를 매개변수화 할 수 있음 단일 배개변수의 경우 segment를 사용함 모든 값을 포괄하는 매개변수(catch-all)의 경우 [...sagment]를 사용함 선택적 포괄 매개변수의 경우 [[...sagment]]를 사용함 params 속성을 통해 값에 접근할 수 있음


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