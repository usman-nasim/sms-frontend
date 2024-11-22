'use client'

import { useState } from 'react'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

interface Keyword {
  id: number
  keyword: string
  template: string
}

interface KeywordListProps {
  keywords: Keyword[]
  onKeywordUpdated: () => void
}

export default function KeywordList({ keywords, onKeywordUpdated }: KeywordListProps) {
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (keyword: string) => {
    try {
      const response = await fetch(`http://192.168.111.43:8000/api/keyword/keywords/${keyword}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete keyword')
      }
      onKeywordUpdated()
    } catch (error) {
      console.error('Error deleting keyword:', error)
      setError('Failed to delete keyword. Please try again.')
    }
  }

  const handleEdit = (keyword: Keyword) => {
    setEditingKeyword(keyword)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingKeyword) return

    try {
      const response = await fetch(`http://192.168.111.43:8000/api/keyword/keywords/${editingKeyword.keyword}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          keyword: editingKeyword.keyword,
          template: editingKeyword.template,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update keyword')
      }
      setEditingKeyword(null)
      onKeywordUpdated()
    } catch (error) {
      console.error('Error updating keyword:', error)
      setError('Failed to update keyword. Please try again.')
    }
  }

  if (keywords.length === 0) {
    return <p className="text-black">No keywords found. Add a new keyword to get started.</p>
  }

  return (
    <div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white  text-black">
          {keywords.map((keyword) => (
            <tr key={keyword.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{keyword.keyword}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{keyword.template}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(keyword)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(keyword.keyword)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingKeyword && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full text-black">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Keyword</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Keyword</label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={editingKeyword.keyword}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">Template</label>
                <textarea
                  id="template"
                  name="template"
                  value={editingKeyword.template}
                  onChange={(e) => setEditingKeyword({ ...editingKeyword, template: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingKeyword(null)}
                  className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
