'use client'

import { useState, useEffect } from 'react'
import KeywordList from './KeywordList'
import KeywordForm from './KeywordForm'

export default function KeywordListClient() {
  const [keywords, setKeywords] = useState<Array<{ id: number; keyword: string; template: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKeywords = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://192.168.111.43:8000/api/keyword/keywords')
      if (!response.ok) {
        throw new Error('Failed to fetch keywords')
      }
      const data = await response.json()
      setKeywords(data)
    } catch (error) {
      console.error('Error fetching keywords:', error)
      setError('Failed to load keywords. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  return (
    <>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Add New Keyword</h2>
          <div className="mt-5">
            <KeywordForm onKeywordAdded={fetchKeywords} />
          </div>
        </div>
      </div>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Keyword List</h2>
          <div className="mt-5">
            {isLoading ? (
              <p>Loading keywords...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <KeywordList keywords={keywords} onKeywordUpdated={fetchKeywords} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
