"use client"

import { useEffect } from "react"
import { PATIENT_SATISFACTION_SUBMITTED_STORAGE_KEY } from "@/lib/pso/satisfaction"

export function PatientSatisfactionSubmissionFlag() {
  useEffect(() => {
    window.localStorage.setItem(PATIENT_SATISFACTION_SUBMITTED_STORAGE_KEY, String(Date.now()))
  }, [])

  return null
}
