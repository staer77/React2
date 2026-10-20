'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  // Optimistic Updates(낙관적 업데이트)
  // 클라이언트 전용 컴포넌트 - 초기 likes 값을 받아 로컬에서 즉시 반영합니다.
  // 서버에 저장하지 않고, 단순히 UI 상에서 좋아요 수를 증가시키는 역할을 합니다.
  const [count, setCount] = useState<number>(likes);

  const handleLike = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <button type="button" onClick={handleLike}>
      좋아요 {count}
    </button>
  );
}
