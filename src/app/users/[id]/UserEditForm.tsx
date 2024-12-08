'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// APIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

type User = {
  id: string;
  email: string;
  name: string;
  prefecture: string;
}

// ユーザー情報を更新する関数
async function updateUser(id: string, userData: Partial<User>): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

type UserEditFormProps = {
  initialUser: User;
}

export default function UserEditForm({ initialUser }: UserEditFormProps) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // 編集内容を保存
  const handleSave = async () => {
    if (!editedUser) return;
    
    setIsLoading(true);
    const success = await updateUser(user.id, editedUser);
    
    if (success) {
      setUser(editedUser);
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-24 h-24 relative">
            <Image
              src="/images/default-avatar.svg"
              alt="avatar"
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedUser?.name || ''}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="text-2xl font-bold text-gray-900 border rounded px-2 py-1"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            )}
            <p className="text-gray-500">ID: {user.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">メールアドレス</h3>
            {isEditing ? (
              <input
                type="email"
                value={editedUser?.email || ''}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">都道府県</h3>
            {isEditing ? (
              <input
                type="text"
                value={editedUser?.prefecture || ''}
                onChange={(e) => setEditedUser({ ...editedUser, prefecture: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-gray-900">{user.prefecture}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                編集
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                削除
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
} 