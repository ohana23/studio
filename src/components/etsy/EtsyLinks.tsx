'use client'

import { useEffect, useState } from 'react'

interface Props {
  query: string
}

export default function EtsyLinks({ query }: Props) {
  const [links, setLinks] = useState<string[]>([])

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch(`/api/etsy-search?q=${encodeURIComponent(query)}`)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data.links)) {
          setLinks(data.links)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchLinks()
  }, [query])

  if (links.length === 0) return null

  return (
    <div className="mt-1 space-y-1">
      {links.map((link, idx) => (
        <div key={idx}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Etsy Link
          </a>
        </div>
      ))}
    </div>
  )
}
