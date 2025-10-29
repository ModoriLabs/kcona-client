'use client'

import { useState } from 'react'
import { BASE_URL } from 'src/constants'

export type ProofResult = {
  success?: boolean
  error?: string
  data?: {
    extractedParameters: {
      documentTitle: string
      receivingBankAccount: string
      recipientName: string
      senderNickname: string
      transactionAmount: string
      transactionDate: string
    }
    provider: string
    receipt: {
      claim: {
        context: string
        epoch: number
        identifier: string
        owner: string
        parameters: string
        provider: string
        timestampS: number
      }
      signatures: {
        attestorAddresS: string
        claimSignature: { type: 'Buffer'; data: number[] }
        resultSignature: { type: 'Buffer'; data: number[] }
      }
    }
  }
}

export function Proof({
  onNext,
  proofResult,
  setProofResult,
}: {
  onNext: (proof: ProofResult) => void
  proofResult: ProofResult | null
  setProofResult: (proof: ProofResult) => void
}) {
  const [issueDate, setIssueDate] = useState('20251028')
  const [certificateNumber, setCertificateNumber] =
    useState('9312-ANEF-IOMUQZJD')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    issueDate?: string
    certificateNumber?: string
  }>({})

  // Certificate number formatting
  const formatCertificateNumber = (value: string): string => {
    const cleanValue = value.replace(/[-\s]/g, '')

    if (/^[0-9A-Za-z]*$/.test(cleanValue)) {
      const upperValue = cleanValue.toUpperCase()

      if (upperValue.length > 8) {
        return (
          upperValue.slice(0, 4) +
          '-' +
          upperValue.slice(4, 8) +
          '-' +
          upperValue.slice(8, 16)
        )
      } else if (upperValue.length > 4) {
        return upperValue.slice(0, 4) + '-' + upperValue.slice(4, 8)
      }
      return upperValue
    }

    return value
  }

  // Validation
  const validateForm = (): boolean => {
    const errors: { issueDate?: string; certificateNumber?: string } = {}

    if (!issueDate) {
      errors.issueDate = '발급일자를 입력해주세요'
    } else if (!/^\d{8}$/.test(issueDate)) {
      errors.issueDate = 'YYYYMMDD 형식으로 입력해주세요'
    }

    if (!certificateNumber) {
      errors.certificateNumber = '증명서번호를 입력해주세요'
    } else if (!/^\d{4}-[A-Z]{4}-[A-Z]{8}$/.test(certificateNumber)) {
      errors.certificateNumber = '올바른 형식이 아닙니다 (XXXX-XXXX-XXXXXXXX)'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Generate proof
  const handleGenerateProof = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const formattedDate = issueDate.replace(
        /(\d{4})(\d{2})(\d{2})/,
        '$1-$2-$3',
      )

      const response = await fetch(`${BASE_URL}/api/generate-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issuedDate: formattedDate,
          issueNumber: certificateNumber,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate proof')
      }

      const data = await response.json()
      setProofResult(data)
    } catch (error) {
      console.error('Proof generation error:', error)
      setProofResult({
        success: false,
        error: 'Failed to generate proof. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (proofResult && proofResult.success) {
      onNext(proofResult)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Generate Proof</h2>
      </div>

      {/* Instructions */}
      <div className="space-y-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="font-semibold text-foreground">
          Enter Proof Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter the <b>Issuance Date</b> and <b>Certificate Number</b> displayed
          on the transfer confirmation certificate exactly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerateProof} className="space-y-4">
        {/* Issue Date */}
        <div className="space-y-2">
          <label
            htmlFor="issueDate"
            className="text-sm font-medium text-foreground">
            Issuance Date
          </label>
          <input
            id="issueDate"
            type="text"
            value={issueDate}
            disabled={!!proofResult?.success}
            onChange={(e) => {
              setIssueDate(e.target.value)
              if (validationErrors.issueDate) {
                setValidationErrors((prev) => ({
                  ...prev,
                  issueDate: undefined,
                }))
              }
            }}
            placeholder="YYYYMMDD (e.g. 20250124)"
            maxLength={8}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 ${
              validationErrors.issueDate ? 'border-destructive' : 'border-input'
            }`}
          />
          {validationErrors.issueDate && (
            <p className="text-xs text-destructive">
              {validationErrors.issueDate}
            </p>
          )}
        </div>

        {/* Certificate Number */}
        <div className="space-y-2">
          <label
            htmlFor="certificateNumber"
            className="text-sm font-medium text-foreground">
            Certificate Number
          </label>
          <input
            id="certificateNumber"
            type="text"
            value={certificateNumber}
            disabled={!!proofResult?.success}
            onChange={(e) => {
              const formatted = formatCertificateNumber(e.target.value)
              setCertificateNumber(formatted)
              if (validationErrors.certificateNumber) {
                setValidationErrors((prev) => ({
                  ...prev,
                  certificateNumber: undefined,
                }))
              }
            }}
            placeholder="XXXX-XXXX-XXXXXXXX"
            maxLength={18}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 ${
              validationErrors.certificateNumber
                ? 'border-destructive'
                : 'border-input'
            }`}
          />
          {validationErrors.certificateNumber && (
            <p className="text-xs text-destructive">
              {validationErrors.certificateNumber}
            </p>
          )}
        </div>

        {/* Proof Result */}
        {proofResult && (
          <div
            className={`rounded-lg border p-4 backdrop-blur ${
              proofResult.success
                ? 'border-primary/30 bg-primary/10'
                : 'border-destructive/30 bg-destructive/10'
            }`}>
            {proofResult.success ? (
              <div className="space-y-2">
                <p className="font-semibold text-primary">✅ Proof Generated</p>
                {proofResult.data?.extractedParameters && (
                  <div className="space-y-1 text-sm text-foreground">
                    <p>
                      Transfer Amount:{' '}
                      {proofResult.data.extractedParameters.transactionAmount}
                    </p>
                    <p>
                      Transfer Date:{' '}
                      {proofResult.data.extractedParameters.transactionDate}
                    </p>
                    <p>
                      Recipient Name:{' '}
                      {proofResult.data.extractedParameters.recipientName}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-destructive">
                  ❌ Failed to Generate Proof
                </p>
                <p className="text-sm text-muted-foreground">
                  {proofResult.error || 'An unknown error occurred.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {proofResult?.success ? (
            <button
              type="button"
              onClick={handleNext}
              className="cursor-pointer w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg">
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? 'Generating Proof...' : 'Generate Proof'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
