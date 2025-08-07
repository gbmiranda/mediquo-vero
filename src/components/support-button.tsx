'use client'

import React from 'react'

export default function SupportButton() {
  const handleSupportClick = () => {
    window.open('https://mediquo5639.zendesk.com/hc/pt-br/requests/new?ticket_form_id=36518462068884', '_blank')
  }

  return (
    <div
      onClick={handleSupportClick}
      className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9] text-white flex items-center justify-center cursor-pointer"
      role="button"
      aria-label="Suporte"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-8 h-8"
      >
        <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z"/>
        <circle cx="9" cy="13" r="1"/>
        <circle cx="15" cy="13" r="1"/>
        <path d="M18 11.03C17.52 8.18 15.04 6 12.05 6c-3.03 0-6.29 2.51-6.03 6.45 2.47-1.01 4.33-3.21 4.86-5.89 1.31 2.63 4 4.44 7.12 4.47z"/>
      </svg>
    </div>
  )
}
