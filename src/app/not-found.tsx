"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <div className="mb-6">
          <AlertCircle 
            className="h-16 w-16 mx-auto mb-4" 
            style={{ color: '#D63066' }}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A0038' }}>
          Página não encontrada
        </h2>
        
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Link href="/">
          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            <Home className="h-4 w-4 mr-2" />
            Voltar para o início
          </Button>
        </Link>
      </div>
    </div>
  )
}