import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import UserEditForm from './UserEditForm'

// APIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// ユーザーの型定義
type User = {
  id: string;
  email: string;
  name: string;
  prefecture: string;
}

// 特定のユーザーデータを取得する関数
async function getUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      cache: 'no-store'  // キャッシュを無効化
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar currentPath="/users" />

        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/users" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <span className="text-xl mr-1">←</span>
              <span>登録者一覧に戻る</span>
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <UserEditForm initialUser={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 