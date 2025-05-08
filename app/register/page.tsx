"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Configuración de la URL del backend desde la variable de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAccepted: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Validar que la URL del backend esté definida
  if (!API_BASE_URL) {
    console.error("Error: NEXT_PUBLIC_API_URL no está definida en .env.local")
    setError("Error de configuración: La URL del servidor no está definida. Contacta al administrador.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError(null) // Limpiar error al cambiar cualquier campo
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: checked,
    }))
    setError(null)
  }

  // Función para generar Nombre_Usuario con número incremental si es necesario
  const generateUsername = async (firstName: string, lastName: string): Promise<string> => {
    const baseUsername = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, "")
    let username = baseUsername
    let counter = 1

    // Verificar si el nombre de usuario ya existe
    while (true) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/check/${username}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            `Error ${response.status}: ${
              errorData.error || "No se pudo verificar el nombre de usuario"
            }`
          )
        }
        const { exists } = await response.json()
        if (!exists) {
          return username
        }
        username = `${baseUsername}${counter}`
        counter++
      } catch (err: any) {
        if (err.message.includes("Failed to fetch")) {
          throw new Error(
            "No se pudo conectar con el servidor. Verifica que el servidor esté corriendo y que CORS esté configurado."
          )
        }
        throw new Error(
          `Error al verificar el nombre de usuario: ${err.message || "Error desconocido"}`
        )
      }
    }
  }

  // Validar la contraseña
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres."
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe incluir al menos un número."
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "La contraseña debe incluir al menos una letra."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validaciones en el frontend
    if (!API_BASE_URL) {
      setError("Error de configuración: La URL del servidor no está definida. Contacta al administrador.")
      return
    }
    if (!formData.firstName || !formData.lastName) {
      setError("Por favor completa el nombre y apellido.")
      return
    }
    if (!formData.email) {
      setError("Por favor ingresa un correo electrónico válido.")
      return
    }
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (!formData.termsAccepted) {
      setError("Debes aceptar los términos y condiciones.")
      return
    }

    setIsLoading(true)

    try {
      // Generar Nombre_Usuario
      const nombreUsuario = await generateUsername(formData.firstName, formData.lastName)

      // Calcular la fecha de expiración (6 meses desde hoy)
      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + 6)

      // Datos para enviar al backend
      const userData = {
        Nombre_Usuario: nombreUsuario,
        Contraseña: formData.password,
        Mail: formData.email,
        FK_Perfil: 7,
        FK_Estatus: 3,
        FK_Persona: null,
        Expiracion: expirationDate.toISOString(),
        FK_UserAlta: null, // Cambiado a null
        Estado: "Desconectado",
      }

      // Enviar solicitud al backend
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Error ${response.status}: ${errorData.error || "Error al registrar el usuario"}`
        )
      }

      const newUser = await response.json()
      setSuccess("¡Usuario registrado exitosamente! Redirigiendo al inicio de sesión...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al registrar el usuario.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br to-white-10 to-white-100">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] animate-in fade-in duration-700">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/images/logo.png"
            alt="Hotel Del Ángel"
            width={200}
            height={80}
            className="mb-4 transition-transform hover:scale-105"
          />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crea tu cuenta</h1>
          <p className="text-sm text-muted-foreground">Regístrate para disfrutar de una experiencia única en nuestros hoteles</p>
        </div>
        <Card className="shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>Éxito</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Juan"
                      className="pl-9 transition-all focus:ring-2 focus:ring-blue-500"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Pérez"
                      className="pl-9 transition-all focus:ring-2 focus:ring-blue-500"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className="pl-9 transition-all focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-9 transition-all focus:ring-2 focus:ring-blue-500"
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={handleCheckboxChange}
                  required
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </Link>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={isLoading || !formData.termsAccepted}
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </CardContent>
          </form>
          <div className="px-6 pb-6">
            <Separator className="my-4" />
            <div className="space-y-4">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.37-.98 2.53-2.08 3.3v2.74h3.36c1.97-1.81 3.11-4.47 3.11-7.8z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23.5c2.97 0 5.46-1.01 7.28-2.73l-3.36-2.74c-1.01.68-2.3 1.08-3.92 1.08-3.01 0-5.57-2.03-6.48-4.76H2.01v2.99C3.82 20.87 7.65 23.5 12 23.5z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.52 14.24c-.23-.69-.36-1.43-.36-2.24s.13-1.55.36-2.24V6.77H2.01C1.36 8.07 1 9.5 1 12s.36 3.93 1.01 5.23l3.51-2.99z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.42c1.62 0 3.07.56 4.21 1.66l3.16-3.16C17.46 2.01 14.97 1 12 1 7.65 1 3.82 3.63 2.01 7.27l3.51 2.99c.91-2.73 3.47-4.76 6.48-4.76z"
                    fill="#EA4335"
                  />
                </svg>
                Registrarse con Google
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.91 8-4.94 8-9.95z"
                    fill="#3b5998"
                  />
                </svg>
                Registrarse con Facebook
              </Button>
              <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}