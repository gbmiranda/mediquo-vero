"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f3ff]">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-[#1e1e4b] mb-4">Página não encontrada</h2>
        <p className="text-[#4a4a68] mb-6">A página que você está procurando não existe ou foi movida.</p>
        <Link href="/">
          <Button className="w-full bg-gradient-to-r from-[#6c3ce9] to-[#39c0d4] hover:from-[#5b33c5] hover:to-[#32a7b9]">
            Voltar para o início
          </Button>
        </Link>
      </div>
    </div>
  )
}
