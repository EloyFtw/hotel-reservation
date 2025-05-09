"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Configuración de la URL del backend desde la variable de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Limpiar error al cambiar cualquier campo
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!formData.email.trim()) {
      setError("Por favor ingresa un correo electrónico.")
      setIsLoading(false)
      return
    }
    if (!formData.password.trim()) {
      setError("Por favor ingresa una contraseña.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      if (!data.token) {
        throw new Error("No se recibió un token en la respuesta")
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error en el login:", err)
      if (err.message.includes("Failed to fetch")) {
        setError("No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.")
      } else {
        setError(err.message || "Correo o contraseña incorrectos.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src="/images/logo.png" alt="Hotel Del Ángel" width={180} height={72} className="mb-4" />
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      className="pl-9"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-9 pr-9"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
            </CardContent>
          </form>
          <div className="px-6 pb-6">
            <Separator className="my-4" />
            <div className="space-y-4">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                Continuar con Google
              </Button>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                Continuar con Facebook
              </Button>
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}