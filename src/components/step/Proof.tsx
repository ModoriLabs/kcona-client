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
  const [issueDate, setIssueDate] = useState('20241028')
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
        error: 'Proof 생성에 실패했습니다. 다시 시도해주세요.',
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
        <h2 className="text-2xl font-bold">Proof 생성</h2>
      </div>

      {/* Instructions */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold">증명서 정보 입력</h3>
        <p className="text-sm text-gray-600">
          송금확인증에 표시된 발급일자와 증명서번호를 정확히 입력하세요.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerateProof} className="space-y-4">
        {/* Issue Date */}
        <div className="space-y-2">
          <label htmlFor="issueDate" className="text-sm font-medium">
            발급일자
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
            placeholder="YYYYMMDD (예: 20250124)"
            maxLength={8}
            className={`w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50 ${
              validationErrors.issueDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.issueDate && (
            <p className="text-xs text-red-500">{validationErrors.issueDate}</p>
          )}
        </div>

        {/* Certificate Number */}
        <div className="space-y-2">
          <label htmlFor="certificateNumber" className="text-sm font-medium">
            증명서번호
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
            className={`w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50 ${
              validationErrors.certificateNumber
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {validationErrors.certificateNumber && (
            <p className="text-xs text-red-500">
              {validationErrors.certificateNumber}
            </p>
          )}
        </div>

        {/* Proof Result */}
        {proofResult && (
          <div
            className={`rounded-lg border p-4 ${
              proofResult.success
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}>
            {proofResult.success ? (
              <div className="space-y-2">
                <p className="font-semibold text-green-800">
                  ✅ Proof 생성 완료
                </p>
                {proofResult.data?.extractedParameters && (
                  <div className="space-y-1 text-sm text-green-700">
                    <p>
                      송금액:{' '}
                      {proofResult.data.extractedParameters.transactionAmount}
                    </p>
                    <p>
                      송금일자:{' '}
                      {proofResult.data.extractedParameters.transactionDate}
                    </p>
                    <p>
                      수취인:{' '}
                      {proofResult.data.extractedParameters.recipientName}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-red-800">❌ Proof 생성 실패</p>
                <p className="text-sm text-red-700">
                  {proofResult.error || '알 수 없는 오류가 발생했습니다.'}
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
              className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
              다음 단계
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? 'Proof 생성 중...' : 'Proof 생성'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
