"use client"

import { useEffect } from "react"
import { PS_SATISFACTION_DRAFT_STORAGE_KEY } from "@/components/satisfaction-ps/satisfaction-ps-draft-storage"

export function SatisfactionPsDraftCleaner() {
  useEffect(() => {
    window.localStorage.removeItem(PS_SATISFACTION_DRAFT_STORAGE_KEY)
  }, [])

  return null
}
