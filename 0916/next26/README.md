- http://localhost:3000/posts/nextjs
- http://localhost:3000/posts/routing
- http://localhost:3000/posts/ssr-ssg
- http://localhost:3000/posts/dynamic-routes

## 20261014 (7주차)

### 1. Server Component vs Client Component 사용 기준

- **개요**: 서버에서 데이터를 가져와 UI의 일부를 렌더링하고, 선택적으로 결과를 캐시(Cache)한 후 클라이언트로 스트리밍할 수 있습니다. 클라이언트와 서버 환경의 기능이 다르므로 사용 사례에 맞게 컴포넌트를 분리하여 필요한 로직을 실행합니다.

| 구분                 | 사용해야 하는 경우 (핵심 역할)                                                                                                                                                                                                                                 | 주요 키워드 / 예시                                                                                                |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Server Component** | - 서버의 DB 또는 API에서 직접 데이터를 가져올 때<br>- API Key, Token 등 보안 데이터를 클라이언트에 노출하지 않을 때<br>- 브라우저로 전송되는 JavaScript 번들 양을 줄이고 싶을 때<br>- FCP(First Contentful Paint)를 개선하고 콘텐츠를 점진적으로 스트리밍할 때 | `async/await`, `fetch`, DB 쿼리                                                                                   |
| **Client Component** | - 상태(State) 및 이벤트 핸들러가 필요할 때<br>- 생명주기(Lifecycle) 로직이 필요할 때<br>- 브라우저 전용 API를 사용할 때<br>- 사용자 정의(Custom) Hook을 사용할 때                                                                                              | `'use client'`, `useState`, `useEffect`, `onClick`, `onChange`, `localStorage`, `window`, `navigator.geolocation` |

#### 컴포넌트 조합 예시 (Server ➔ Client Props 전달)

- `<PostPage>`(Server Component)는 게시물 데이터를 가져오고, 클라이언트 측 상호작용을 처리하는 `<LikeButton>`(Client Component)에 `props`로 데이터를 전달합니다.

```tsx
// dummy data (@/lib/data.tsx)
export const posts = [
  {
    id: 'nextjs',
    title: 'Next.js 소개',
    content: 'Next.js는 React 기반의 풀스택 프레임워크입니다.',
    likes: 5,
  },
  {
    id: 'routing',
    title: 'App Router 알아보기',
    content: 'Next.js 13부터는 App Router가 도입되었습니다.',
    likes: 3,
  },
  {
    id: 'ssr-ssg',
    title: 'SSR vs SSG',
    content: '서버사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다.',
    likes: 0,
  },
  {
    id: 'dynamic-routes',
    title: '동적 라우팅',
    content: 'Next.js에서 [slug]를 활용한 라우팅 방식입니다.',
    likes: 0,
  },
];
```

```tsx
// Server Component (page.tsx)
import LikeButton from '@/ui/like-button';
import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // getPost API 대신 직접 posts 배열에서 슬러그에 해당하는 포스트 조회
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* 숫자 타입 전달을 위해 중괄호만 사용 */}
        <LikeButton likes="{post.likes}" />
      </main>
    </div>
  );
}
```

---

### 2. 낙관적 업데이트 (Optimistic Update) vs 비관적 업데이트 (Pessimistic Update)

#### 낙관적 업데이트 (Optimistic Update)

- **정의**: 사용자에 의해 이벤트(예: 좋아요 클릭)가 발생하면, 서버 응답을 기다리지 않고 요청의 성공을 낙관(가정)하여 브라우저의 UI를 즉시 변경하는 방식입니다.
- **목적**: 네트워크 지연 동안에도 앱이 빠르게 반응하도록 느끼게 합니다. 만일 서버 응답이 없거나 실패하면 UI를 원래 상태로 되돌립니다(Rollback).
- **장점**: 서버 응답 속도와 무관하게 즉각적인 피드백을 제공하여 체감 속도와 사용자 경험(UX)을 향상시킵니다.
- **단점**: 서버 오류 발생 시 잠시 잘못된 정보가 표시될 수 있으며, 롤백을 위한 복구 로직이 필요합니다.

#### 비관적 업데이트 (Pessimistic Update)

- **정의**: 이벤트 발생 시 먼저 서버에 요청을 보내고, 서버로부터 성공 응답을 받은 후에 클라이언트 UI를 업데이트합니다.
- **장점**: 서버 응답을 기반으로 하므로 데이터 일관성이 보장되며 잘못된 정보가 표시될 염려가 없습니다.
- **단점**: 서버 응답을 기다려야 하므로 네트워크 지연 시 체감 속도가 느려지고 UX가 저하될 수 있습니다.

| 구분                 | 낙관적 업데이트 (Optimistic) | 비관적 업데이트 (Pessimistic)    |
| :------------------- | :--------------------------- | :------------------------------- |
| **UI 업데이트 시점** | 요청 직후 즉시               | 서버 응답을 받은 후              |
| **응답 실패 시**     | 원래 상태로 롤백 (Rollback)  | UI 변경 없음                     |
| **속도 및 반응성**   | 빠름                         | 상대적으로 느림                  |
| **적용 예시**        | 좋아요 버튼, 댓글 작성       | 데이터 조회 후 렌더링, 결제 처리 |

#### LikeButton 구현 및 상태(State) 분석

```tsx
// src/ui/like-button.tsx
'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  // 초기 likes 값을 받아 로컬 상태에 반영
  const [count, setCount] = useState<number>(likes ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleClick = async () => {
    // 1. 낙관적 업데이트: 요청 진행 상태로 변경 및 카운트 즉시 +1
    setIsLiking(true);
    setCount((c) => c + 1);

    // 2. 실제 저장 로직(API 호출 등) 위치
    // 예: await fetch('/api/like', { method: 'POST', body: JSON.stringify({ id }) })

    // 3. 네트워크 지연 시뮬레이션 (중복 클릭 방지 확인 시 3000ms로 조정하여 테스트)
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <button onClick={handleClick} disabled={isLiking} aria-pressed={false}>
      👍 {count}
    </button>
  );
}
```

- **`count` state**: 좋아요 버튼을 클릭한 횟수 (초기값: `data`의 `likes` 필드)
- **`isLiking` state**: 서버 요청 진행 여부를 나타내는 상태 (초기값: `false`)
  1. **중복 클릭 방지**: `isLiking`이 `true`인 동안 버튼을 `disabled`로 만들어 중복 요청(중복 낙관적 업데이트)을 차단합니다.
  2. **UI 피드백**: 로딩 스피너나 상태 문구 표시에 활용 가능합니다.
  3. **상태 안정화**: 서버 요청이 끝날 때까지 추가 상태 변경을 멈추어 일관된 동작을 보장합니다.

---

### 3. Null 병합 연산자(`??`) vs 논리 OR 연산자(`||`)

- **Falsy(거짓 같은 값)란?**: JavaScript의 조건문이나 논리 연산 등 Boolean 문맥에서 `false`로 평가되는 값들을 의미합니다.
  1. `false`: 불리언 false 그 자체
  2. `0`: 숫자 0
  3. `''`: 빈 문자열
  4. `null`: 값이 없음을 개발자가 의도적으로 명시한 값
  5. `undefined`: 값이 할당되지 않았을 때 시스템이 자동 부여하는 값
  6. `NaN`: Not-a-Number (숫자가 아님)

- **왜 `likes` 대신 `likes ?? 0`으로 작성했을까?**:
  - **Null 병합 연산자 (`??`)**: 왼쪽 피연산자가 `null` 또는 `undefined`일 때만 오른쪽 값을 반환하고, 그렇지 않으면 왼쪽 값을 그대로 반환합니다.
  - **OR 연산자 (`||`)와의 차이**: `||` 연산자는 Falsy 값(`false`, `0`, `""`, `null`, `undefined`, `NaN`) 전체를 오른쪽 값으로 대체합니다.
- **테스트 비교 (`data.tsx`의 `likes` 값을 `false`나 `''`로 변경 시)**:
  - **`??` 연산자 사용 시**: `false`는 `null`이나 `undefined`가 아니므로 `false`가 그대로 반환됩니다. React는 JSX 내부에서 불리언 값을 렌더링하지 않으므로 `{count}` 부분에 아무것도 표시되지 않습니다.
  - **`||` 연산자 사용 시**: `false`와 빈 문자열(`''`) 모두 Falsy 값으로 적용되어 우항인 `0`이 반환되고 화면에 `0`이 표시됩니다.

---

### 4. Next.js에서 Server 및 Client Component의 작동 원리

#### Server Component의 작동과 직렬화(Serialization)

- Next.js는 서버에서 React API를 사용해 라우팅 세그먼트(`layout`, `page`)별 묶음(Chunk) 단위로 렌더링을 조정합니다.
- **직렬화(Serialization)**: 메모리(RAM) 상에서 주소값(참조값, 포인터)으로 얽혀 있는 객체를 네트워크로 전송하거나 디스크에 저장할 수 있도록 주소값에 의존하지 않는 1차원 연속 바이트(Byte) 또는 문자열 형태로 변환하는 과정입니다. (반대로 원래 메모리 객체 구조로 복원하는 것은 **역직렬화(Deserialization)**라고 합니다.)
- **RSC Payload (React Server Component Payload)**: 렌더링된 Server Component 트리를 직렬화하여 표현한 컴팩트한 데이터 형식으로, 브라우저 DOM 업데이트에 사용됩니다.
  - **포함 내용**:
    1. Server Component의 렌더링 결과
    2. Client Component가 렌더링될 위치(Placeholder) 및 해당 JS 파일 참조 정보
    3. Server Component에서 Client Component로 전달되는 모든 `props`

#### RSC Payload: JSON vs Binary

- 과거(RSC 초기)에는 JSON 문자열로 데이터를 전달했으나, 최신 React 및 Next.js App Router는 **React 전용 컴팩트 이진(Binary) 포맷**으로 스트림(Stream)을 통해 전달합니다.

| 비교 항목       | JSON (과거)          | Binary (현재 RSC)                     |
| :-------------- | :------------------- | :------------------------------------ |
| **크기**        | 크다                 | 작다 (Compact)                        |
| **파싱 속도**   | 느리다 (문자열 파싱) | 빠르다 (스트림 + 이진 파싱)           |
| **구조 표현력** | 제한적 (문자만)      | 더 복잡한 참조 및 내부 구조 표현 가능 |
| **RSC 최적화**  | -                    | 컴포넌트 트리 및 스트리밍에 최적화됨  |

#### Client Component의 작동 (첫 번째 Load 3단계)

1. **HTML**: 사용자에게 경로의 비대화형(정적) 미리보기를 즉시 보여주는 데 사용됩니다.
2. **RSC Payload**: 서버에서 전달된 바이너리 스트림을 해석해 Client와 Server Component 트리를 조정(Reconcile)합니다.
3. **JavaScript**: Client Component를 **Hydration**(정적 HTML DOM에 이벤트 핸들러를 연결하여 인터랙티브하게 만드는 프로세스)합니다.
4. **후속 네비게이션 (Subsequent Navigation)**: **RSC 페이로드**는 즉시 탐색할 수 있도록 prefetch 및 cache됩니다. **client component**는 server에서 렌더링된 HTML 없이 전적으로 client에서 렌더링됩니다.

---

## 20261007 (6주차)

### 1. 동적 라우트와 `generateStaticParams`

- **매개변수 처리**: Next.js가 넘겨준 객체 중 `params`를 객체 구조 분해 할당으로 받습니다. `params`는 `Promise`이므로 `await params`로 추출합니다.
- **`generateStaticParams()`의 동작**:
  - 함수 자체는 `slug` 배열만 반환합니다.
  - Next.js 빌드 프로세스가 이 배열을 순회(`map`)하며 각 `slug`에 대해 `page.tsx`를 실행하여 **정적 HTML을 사전 생성(SSG)**합니다.

#### Server Component에서 `await` 없이도 `async`를 사용하는 이유

1. **코드 일관성 유지**: 페이지별로 일반 함수와 비동기 함수가 혼용되는 혼란을 방지하고 공식 문서 패턴과 일치시킵니다.
2. **향후 확장성 고려**: 현재 더미 데이터를 쓰더라도 추후 DB 조회나 API 연동(`fetch`) 코드가 추가될 때 함수 선언부를 수정할 필요가 없습니다.
3. **RSC 호환성 및 최적화**: Server Component는 본질적으로 `Promise` 반환을 전제로 설계되어 있어 `async` 선언에 따른 오버헤드가 거의 없습니다.

#### `generateStaticParams` 유무에 따른 차이 비교

| 항목                 | `generateStaticParams` 없음 (동적 렌더링 / SSR)  | `generateStaticParams` 있음 (정적 생성 / SSG) |
| :------------------- | :----------------------------------------------- | :-------------------------------------------- |
| **페이지 생성 시점** | 요청 시 서버에서 실시간 생성 (SSR / ISR)         | 빌드 타임에 사전 생성 (SSG)                   |
| **초기 로딩 속도**   | 서버 렌더링 필요 ➔ 상대적으로 느림               | 완성된 정적 HTML 즉시 제공 ➔ 매우 빠름        |
| **SEO**              | 가능하지만 요청 시 렌더링됨                      | 매우 유리 (검색엔진이 즉시 HTML 크롤링)       |
| **유연성**           | 무한한 `slug` 동적 지원 가능 (실시간 DB 조회 등) | 빌드 시점에 `slug` 목록을 미리 알아야 함      |

```tsx
// 블로그 목록 (Blog.tsx)
import Link from 'next/link';
import { posts } from './posts';

export default function Blog() {
  return (
    <div>
      <main>
        <h1>블로그 목록</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href="{`/blog2/${post.slug}`}">{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
```

```tsx
// 블로그 상세 페이지 (PostPage.tsx)
import { notFound } from 'next/navigation';
import { posts } from '../posts';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <article>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-6">{post.date}</p>
        <div className="prose">{post.content}</div>
      </article>
    </main>
  );
}
```

---

### 2. 네트워크 지연 대응 및 프리페칭(Prefetching) 제어

#### 느린 네트워크 피드백 (`useLinkStatus`)

- 체감 성능을 개선하기 위해 `useLinkStatus` Hook을 사용하여 전환이 진행되는 동안 인라인 시각적 피드백(스피너, 텍스트 글리머 등)을 표시할 수 있습니다.

```css
/* 100ms 지연을 주어 빠른 전환 시에는 스피너가 깜빡이지 않도록 처리 */
.spinner {
  opacity: 0;
  animation:
    fadeIn 500ms 100ms forwards,
    rotate 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
```

#### 프리페칭 비활성화 (`prefetch={false}`)

- 무한 스크롤 테이블 등 대량의 링크 목록을 렌더링할 때 불필요한 리소스 사용을 방지하기 위해 `prefetch={false}`로 설정할 수 있습니다.

```tsx
<Link href="/blog" prefetch="{false}">
  Blog
</Link>
```

- **단점**: 정적 라우팅은 클릭 시점에만 데이터를 가져오며, 동적 라우팅은 이동 전 서버 렌더링을 기다려야 합니다.
- **절충안**: 프리페치를 완전히 끄는 대신 **마우스 호버(Hover) 시에만 프리페치를 활성화**하면 방문 가능성이 높은 경로로만 리소스를 제한할 수 있습니다.

---

### 3. Hydration 미완료 문제와 번들 최적화

- **Hydration의 역할**: SSR로 생성된 정적 HTML에 클라이언트 측 JavaScript를 연결(이벤트 리스너, 상태 관리 주입)하여 동적 상호작용이 가능하도록 만드는 과정입니다.
- **문제 원인**: `<Link>`는 Client Component이므로 프리페치를 수행하려면 Hydration이 선행되어야 합니다. 최초 진입 시 대용량 JS 번들로 인해 Hydration이 지연되면 프리페칭도 늦어집니다.
- **해결책**: `@next/bundle-analyzer` 플러그인을 활용해 큰 비중을 차지하는 종속성을 파악하고 번들 크기를 축소합니다.

```ts
// next.config.ts
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: true,
};

export default withBundleAnalyzer(nextConfig);
```

---

## 20260930 (5주차)

### 1. Server Rendering과 초기 HTML 생성

- **App Router**: 계층적 구성이 가능하며 서버에서 렌더링되는 컴포넌트를 통해 성능을 최적화합니다.
- **정적 렌더링 vs 동적 렌더링**:
  - **정적 렌더링**: 빌드 시점이나 재검증(Revalidation) 중에 발생하며 결과가 캐시(Cache)됩니다.
  - **동적 렌더링**: 클라이언트 요청에 대한 응답으로 요청 시점에 실시간 발생합니다.
- **초기 방문 시 HTML 생성 (HTML is generated for the initial visit)**:
  - **일반 React 앱 (CSR)**: 처음 방문 시 빈 HTML과 JS 파일만 내려주고 브라우저가 JS를 실행해야 화면이 그려집니다.
  - **Next.js**: 특정 URL 최초 방문 시 서버가 미리 생성한 HTML(뼈대 + 콘텐츠)을 전달하므로 JS 실행 전에도 화면이 즉시 표시됩니다. 이후 Hydration을 거쳐 상호작용이 가능해지며, 초기 UX와 SEO에 매우 유리합니다.

---

### 2. Prefetching, Streaming, 그리고 Core Web Vitals

#### Prefetching (프리페칭)

- 사용자가 경로를 이동하기 전에 백그라운드에서 해당 경로를 미리 로드하는 프로세스입니다. (`<a>` 태그 대신 `<Link>` 컴포넌트 사용 시 동작)
- **정적 경로**: 전체 경로가 프리페치됩니다.
- **동적 경로**: 프리페치를 건너뛰거나, `loading.tsx`가 있는 경우 부분적으로 프리페칭됩니다.

#### Streaming (스트리밍)

- 서버가 전체 경로 렌더링이 끝날 때까지 기다리지 않고, 준비된 동적 경로의 일부를 즉시 클라이언트로 전송하는 방식입니다.
- `<Suspense>`나 `loading.tsx`를 사용해 경로가 로드되는 동안 대체 UI(Skeleton 등)를 먼저 표시하고 준비가 완료되면 실제 콘텐츠로 교체합니다.
- **개선되는 웹 지표**: TTFB(Time To First Byte), FCP(First Contentful Paint), TTI(Time To Interactive).

#### Core Web Vitals (핵심 웹 지표)

1. **LCP (Largest Contentful Paint)**: 뷰포트 내에서 가장 큰 페이지 요소를 표시하는 데 걸리는 시간
2. **FID (First Input Delay)**: 사용자가 웹페이지와 첫 상호작용을 시도한 순간부터 브라우저가 응답하기까지의 시간
3. **CLS (Cumulative Layout Shift)**: 페이지 로드 중 레이아웃이 갑자기 이동하는 빈도를 측정하여 시각적 안정성을 평가하는 지표

---

### 3. 클라이언트 측 전환 (Client-side Transitions)과 레이아웃 유지

- **Shared Layout Remain Interactive (공유 레이아웃의 상호작용 유지)**:
  - `layout.tsx`는 하위 페이지 간에 공유됩니다(예: `/blog/page.tsx`와 `/blog/[slug]/page.tsx`가 `blog/layout.tsx` 공유).
  - 페이지 이동 시 `layout.tsx`는 리렌더링되지 않고 유지되므로 사이드바, 네비게이션 메뉴, 음악 플레이어 등의 상태(State)와 동작이 끊기지 않습니다.
- **Navigation is Interruptible (중단 가능한 네비게이션)**:
  - 페이지 이동으로 데이터를 불러오는 도중 사용자가 다른 링크를 클릭하면, 이전 네트워크 요청이나 렌더링을 즉시 취소(`cancel`)하고 새로운 요청만 실행합니다.
- **Client-side Transitions의 이점**:
  - 전체 페이지를 새로고침하지 않고 콘텐츠만 동적으로 업데이트하여, 상태 초기화나 스크롤 위치 리셋을 방지하고 서버 렌더링 앱을 SPA처럼 부드럽게 동작하게 만듭니다.

---

### 4. 전환을 느리게 만드는 요인과 해결 방법

1. **동적 경로에 `loading.tsx` 누락**:
   - **문제**: 서버 응답이 올 때까지 화면이 멈춘 것처럼 보입니다.
   - **해결**: `loading.tsx`를 추가하여 부분 프리페칭을 활성화하고 즉시 로딩 UI를 표시합니다.
2. **동적 세그먼트에 `generateStaticParams` 누락**:
   - **문제**: 빌드 시점에 사전 렌더링할 수 있는 경로임에도 요청 시점의 동적 렌더링(SSR)으로 대체되어 속도가 느려집니다.
   - **해결**: `generateStaticParams`를 추가하여 빌드 타임에 정적으로 생성되도록 최적화합니다.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

---

## 20260923 (4주차)

### 1. `<Link>` 컴포넌트와 `RootLayout`

- **`<Link>` 컴포넌트**: HTML `<a>` 요소를 확장하여 프리페칭과 클라이언트 사이드 내비게이션을 제공하는 컴포넌트입니다. `className`이나 `target="_blank"` 같은 `props`는 내부 `<a>` 요소로 전달됩니다.
- **`RootLayout`**: `app` 디렉토리에 반드시 존재해야 하는 최상위 레이아웃입니다.

```tsx
// app/page.tsx (객체 형태로 href 전달 예시)
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen py-2">
      <h1>Root layout</h1>
      <div className="mt-6">
        <Link "/blog", "test", 30 age: href="{{" name: pathname: query: { }, }}>
          Go to Blog
        </Link>
      </div>
    </div>
  );
}
```

```tsx
// app/layout.tsx
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>=== Root Layout Header ===</header>
        <nav>
          <Link href="/">Home</Link> | <Link href="/blog">Blog</Link>
        </nav>
        <main>{children}</main>
        <footer>=== Root Layout Footer ===</footer>
      </body>
    </html>
  );
}
```

---

### 2. 중첩 라우트(Nested Routes)와 동적 렌더링

- **중첩 라우트와 동적 세그먼트**:
  - 폴더는 URL 세그먼트에 매핑되는 경로를 정의하고, 파일(`page.tsx`)은 해당 세그먼트의 UI를 생성합니다.
  - 폴더 이름을 대괄호(`[slug]`)로 묶으면 데이터에서 여러 페이지를 생성하는 동적 경로 세그먼트가 됩니다.
- **`slug` 및 비동기 `params` 이해**:
  - 서버 데이터를 읽을 때의 타임 딜레이 오류를 방지하고 비동기성을 명확히 하기 위해 `params`와 `searchParams`는 `Promise<{ ... }>` 타입으로 선언하며 `async/await`로 처리합니다.
  - 데이터 소스가 크다면 배열의 `.find()` 메서드는 시간 복잡도가 $O(n)$(입력 크기 $n$에 비례해 선형 증가)이므로 실제 서비스에서는 DB 쿼리로 대체해야 합니다.
- **`searchParams`와 동적 렌더링**:
  - `searchParams`(쿼리 스트링)는 사용자 요청이 들어와야만 값을 알 수 있으므로 정적 사전 생성이 불가능하며, 요청 시마다 새로 렌더링(동적 렌더링)됩니다.

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; name?: string }>;
}) {
  const { id = 'non id', name = 'non name' } = await searchParams;
  return (
    <div>
      <h1>Products Page</h1>
      <p>Product ID: {id}</p>
      <p>Product Name: {name}</p>
    </div>
  );
}
```

---

### 3. React vs Next.js 라우팅 방식 비교

| 항목                 | React (기본)                                  | Next.js                                                                                          |
| :------------------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **라우팅 방식**      | 수동 (사용자가 직접 설정)                     | 자동 (폴더/파일 기반)                                                                            |
| **라우터 도구**      | `react-router-dom` 등 외부 라이브러리 필요    | 자체 내장된 파일 기반 라우팅 시스템                                                              |
| **라우트 정의 방식** | 코드에서 직접 `<Route>`로 정의                | 파일/폴더 이름으로 라우트가 자동 매핑됨                                                          |
| **예시**             | `<Route path="/about" element={<About />} />` | **Pages Router**: `pages/about.js` ➔ `/about`<br>**App Router**: `app/about/page.tsx` ➔ `/about` |

- **Pages Router 주요 특징**: 동적 라우트, `getStaticProps` 활용
- **App Router 주요 특징**: 레이아웃 중첩, 서버 컴포넌트 기본 적용, 로딩 UI(`loading.tsx`), 병렬 라우트 지원

---

## 20260916 (3주차)

### 1. 프로젝트 구조화 및 고급 라우팅 패턴

- **Colocation (코로케이션)**: 파일 및 폴더를 기능별로 그룹화하여 프로젝트 구조를 명확하게 정의하는 방식입니다. `app` 디렉토리 내 폴더가 라우팅 구조를 정의하더라도, 내부에 **`page.tsx` 또는 `route.ts` 파일이 추가되기 전까지는 외부에서 해당 경로에 접근할 수 없으므로** 안전하게 컴포넌트나 유틸리티 파일을 함께 배치할 수 있습니다.
- **Route Groups `(folder)`**: 소괄호로 폴더를 감싸면 URL 경로에 영향을 주지 않고 사이트 섹션, 목적, 팀별로 라우트를 분류하거나 동일 수준에서 다중 중첩 레이아웃(특정 그룹 전용 `layout.tsx`, `loading.tsx` 등)을 구성할 수 있습니다.
- **Private Folders `_folder`**: 언더스코어(`_`)로 시작하는 폴더는 라우팅 시스템에서 완전히 제외되는 비공개 디렉토리입니다.
- **Parallel Routes `@slot` & Intercepting Routes**:
  - 슬롯 기반 레이아웃(대시보드 등)이나 모달 라우팅 같은 UI 패턴에 적합합니다.
  - 부모 레이아웃에서 렌더링되는 Named Slots에는 `@slot` 표기를 사용합니다.
  - Intercepting 패턴을 사용하면 URL을 변경하지 않고 현재 레이아웃 내에서 다른 경로(예: 피드에서 사진 클릭 시 모달 표시)를 렌더링할 수 있습니다.

---

### 2. 컴포넌트 계층 구조(Hierarchy)와 메타데이터

- **특수 파일 계층 구조**: 한 세그먼트 내의 특수 파일들은 정해진 순서(레이아웃 ➔ 템플릿 ➔ 에러 경계(`error.tsx`) ➔ 서스펜스 경계(`loading.tsx`) ➔ 페이지(`page.tsx`))로 중첩 렌더링됩니다.
- **`layout.tsx` vs `template.tsx`**:
  - **Layout (정적 유지)**: 여러 페이지에서 공유되는 UI로, 네비게이션 시 State와 상호작용을 유지하며 리렌더링되지 않습니다.
  - **Template (동적 재생성)**: 페이지 전환 시마다 새로운 인스턴스를 마운트하며 State가 초기화됩니다.
- **레이아웃 기본 구성 요소**:
  - `children`: 라우트 전환 시 해당 페이지나 하위 레이아웃이 들어오는 자리
  - `metadata`: title, description 등의 SEO 정보를 Next.js가 자동으로 `<head>`에 삽입
- **Open Graph Protocol**: 링크 공유 시 미리보기 카드(제목, 설명, 이미지)를 생성하는 META 주도의 표준 프로토콜입니다.

---

## 20260909 (2주차)

### 1. 초기 프로젝트 세팅 및 루트 레이아웃

- **`app/layout.tsx` & `app/page.tsx`**: 사용자가 루트(`/`)를 방문하면 두 파일이 함께 렌더링됩니다. 만약 루트 레이아웃 생성을 잊어버리면 Next.js 개발 서버 실행 시 자동으로 생성됩니다.

```tsx
// app/layout.tsx (루트 레이아웃 - html, body 태그 필수)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- **TypeScript 타입 패키지 설치**:
  - 명령어: `pnpm add -D @types/react @types/react-dom` (또는 `npm install -D ...`)
  - **일반 설치 vs `-D`(DevDependencies)**: 일반 설치는 실제 서비스 런타임 구동에 필수적인 패키지이며, `-D`는 빌드, 타입 체크, 테스트, 린팅 등 개발 시점에만 필요한 패키지입니다.

---

### 2. 정적 리소스(`public`)와 디렉토리 컨벤션

- **`public` 디렉토리**: 프로젝트 루트에 생성하여 이미지 등 정적 리소스를 저장하며, 기본 URL(`/`)을 기준으로 참조합니다.

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image alt="profile" height="{100}" src="/profile.png" width="{100}" />
  );
}
```

- **설정 파일 및 디렉토리 분리**:
  - `/src` 디렉토리를 사용하면 애플리케이션 코드와 프로젝트 루트의 설정 파일들을 깔끔하게 분리할 수 있습니다.
  - `.eslintrc.json`은 정적인 JSON 설정 파일인 반면, `eslint.config.mjs`(`.mjs` = Module JavaScript)는 JS 코드로 동적인 설정 구성이 가능합니다.
- **용어 및 라우팅 규칙 정리**:
  - **라우팅(Routing) vs 경로(Path)**: 길을 찾아가는 과정은 '라우팅', 주소 자체는 '패스'로 구분합니다.
  - **세그먼트(Segment)**: URL 경로를 구성하는 각각의 디렉토리 단위를 의미합니다.
  - **동적 라우트 표기법**:
    1. `[segment]`: 단일 동적 매개변수
    2. `[...segment]`: 모든 하위 경로를 포괄하는 매개변수 (Catch-all segments)
    3. `[[...segment]]`: 매개변수가 없는 기본 경로까지 포함하는 선택적 포괄 매개변수 (Optional catch-all segments)

---

## 20260902 (1주차)

### 1. Next.js 개요 및 라우터 종류

- **메타 프레임워크 (Meta-framework)**: Next.js는 React(UI 라이브러리/프레임워크)를 기반으로 라우팅, 서버 렌더링, 이미지·폰트 최적화, 데이터 패칭 등 풀스택 웹 구축 기능을 추가로 제공하는 프레임워크입니다.
- **App Router vs Pages Router**:
  - **App Router**: Server Component, Streaming 등 최신 React 기능을 지원하는 최신 라우터
  - **Pages Router**: 초기부터 사용된 파일 기반 라우터로 현재도 하위 호환 및 유지보수를 위해 지원됨

---

### 2. 고성능 패키지 매니저 `pnpm`과 파일 시스템 링크

- **`pnpm` (Performant NPM)**: 기존 `npm`, `yarn`의 디스크 공간 낭비, 복잡한 의존성(유령 의존성) 문제, 느린 설치 속도를 개선하기 위해 개발된 패키지 매니저입니다.
  - 주요 명령어: `pnpm create next-app@latest`, `pnpm install`, `pnpm dev`

#### Hard Link (하드 링크) vs Symbolic Link (심볼릭 링크)

- **파일의 3요소**:
  1. **Directory Entry**: 파일 이름과 해당 `inode` 번호의 매핑 정보를 담은 특수 파일
  2. **inode**: 권한, 소유자, 크기, 데이터 블록의 실제 위치 등 파일의 모든 메타데이터를 저장하는 구조체
  3. **Data Blocks**: 실제 데이터가 저장되는 디스크 영역

| 구분             | 하드 링크 (Hard Link)                                                                                                               | 심볼릭 링크 (Symbolic Link / Soft Link)                                                                   |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **동작 원리**    | 원본과 **동일한 `inode` 번호**를 가리켜 실제 데이터 블록을 100% 공유함 (원본과 사본의 구별이 없는 완벽히 동일한 파일)               | `inode`를 공유하지 않고 원본 파일의 **경로 문자열(주소)**만 저장하는 특수 파일 (바탕화면 바로가기와 유사) |
| **원본 삭제 시** | 디렉토리 엔트리에서 이름만 하나 지워질 뿐, `link count`가 0이 되지 않는 한 **데이터는 그대로 유지됨**                               | 원본이 삭제되면 경로가 끊어져(Dangling link) **더 이상 사용할 수 없음**                                   |
| **`pnpm` 활용**  | 전역 Store에 패키지를 딱 한 번만 설치하고 각 프로젝트의 `node_modules/.pnpm`에 하드 링크로 연결하여 디스크 용량을 획기적으로 절약함 | 패키지 간의 중첩 의존성 구조를 표현하고 실제 참조 경로를 연결할 때 심볼릭 링크를 함께 조합하여 사용함     |

---

### 3. Hydration 오류 (Hydration Mismatch)

- **원인**: SSR(서버 사이드 렌더링) 과정에서 **서버가 생성한 HTML 구조/내용과 클라이언트에서 React가 첫 렌더링하며 만든 HTML이 불일치할 때** 발생합니다.
- **주요 발생 사례**:
  1. 렌더링 시점마다 달라지는 동적 데이터 사용 (`new Date()`, `Math.random()` 등)
  2. 서버에는 존재하지 않는 브라우저 전용 API(`window`, `localStorage`)를 분기 처리 없이 초기 렌더링에 바로 사용한 경우
  3. 잘못된 HTML 태그 중첩 구조 (예: `<p>` 태그 내부에 `<div>` 태그를 중첩하여 브라우저가 임의로 DOM 구조를 수정한 경우)
