import LikeButton from '@/ui/likeButton';
import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // posts의 id가 number 타입일 경우를 대비해 String으로 형변환하여 안전하게 비교
  const post = posts.find((p) => String(p.id) === String(id));

  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <LikeButton likes={post.likes} />
    </main>
  );
}
