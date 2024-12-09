import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// キャッシュを無効化し、常に動的レンダリングを強制
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 案件の型定義
type Project = {
  id: string;
  project_name: string;
  description: string;
  client_name: string;
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
}

// APIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// APIから案件データを取得する関数
async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// ステータスの日本語表示とスタイル
const statusConfig = {
  'open': { text: '新規', className: 'bg-green-100 text-green-800' },
  'in_progress': { text: '進行中', className: 'bg-blue-100 text-blue-800' },
  'completed': { text: '完了', className: 'bg-gray-100 text-gray-800' }
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar currentPath="/projects" />

        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">案件一覧</h2>
            
            {/* ヘッダー行 */}
            <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 font-medium text-sm text-gray-500">
              <span className="w-8">No</span>
              <span className="w-32">案件タイトル</span>
              <span className="w-32">支援先名称</span>
              <span className="w-24">ステータス</span>
              <span className="w-24">登録日</span>
            </div>

            {/* 案件リスト */}
            <div className="space-y-2 mt-2">
              {projects.map((project, index) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div className="flex items-center space-x-4 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <span className="text-gray-500 w-8">{index + 1}</span>
                    <span className="text-gray-900 w-32 truncate">{project.project_name}</span>
                    <span className="text-gray-600 w-32 truncate">{project.client_name}</span>
                    <span className="w-24">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[project.status].className}`}>
                        {statusConfig[project.status].text}
                      </span>
                    </span>
                    <span className="text-gray-500 w-24">
                      {new Date(project.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </Link>
              ))}

              {projects.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  案件が登録されていません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
