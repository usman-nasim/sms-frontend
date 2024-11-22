'use client'

import { useState } from 'react'

interface KeywordFormProps {
  onKeywordAdded: () => void
}

export default function KeywordForm({ onKeywordAdded }: KeywordFormProps) {
  const [keyword, setKeyword] = useState('')
  const [template, setTemplate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://192.168.111.43:8000/api/keyword/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ keyword, template }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add keyword')
      }
      setKeyword('')
      setTemplate('')
      onKeywordAdded()
    } catch (error) {
      console.error('Error adding keyword:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
          Keyword
        </label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
      </div>
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-black">
          Template
        </label>
        <textarea
          id="template"
          name="template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Keyword
      </button>
    </form>
  )
}
