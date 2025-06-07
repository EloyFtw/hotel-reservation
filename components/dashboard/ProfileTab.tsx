'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Usuario, Ciudad, FormData } from "./types";
import { validateForm, fetchPaises, fetchEstados, fetchCiudades, getToken } from "./utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileTabProps {
  user: Usuario | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  formErrors: Partial<Record<keyof FormData, string>>;
  setFormErrors: (errors: Partial<Record<keyof FormData, string>>) => void;
  paises: string[];
  setPaises: (paises: string[]) => void;
  estados: string[];
  setEstados: (estados: string[]) => void;
  ciudades: Ciudad[];
  setCiudades: (ciudades: Ciudad[]) => void;
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function ProfileTab({
  user,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  paises,
  setPaises,
  estados,
  setEstados,
  ciudades,
  setCiudades,
  error,
  isLoading,
  setError,
  setIsLoading,
}: ProfileTabProps) {
  const router = useRouter();

  // Calcular la edad a partir de la fecha de nacimiento
  useEffect(() => {
    if (formData.Fecha_Nacimiento) {
      const birthDate = new Date(formData.Fecha_Nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData({ ...formData, Edad: age.toString() });
    } else {
      setFormData({ ...formData, Edad: "" });
    }
  }, [formData.Fecha_Nacimiento, setFormData]);

  // Cargar países al montar el componente
  useEffect(() => {
    fetchPaises(setPaises, setError);
  }, [setPaises, setError]);

  // Desglosar la dirección al cargar los datos del usuario
  useEffect(() => {
    if (user?.huesped?.persona?.Direccion) {
      const [calle = "", colonia = "", codigoPostal = "", numeroInterior = "", numeroExterior = ""] =
        user.huesped.persona.Direccion.split(";");
      setFormData({
        ...formData,
        Calle: calle,
        Colonia: colonia,
        CodigoPostal: codigoPostal,
        NumeroInterior: numeroInterior,
        NumeroExterior: numeroExterior,
      });
    }
  }, [user, setFormData]);

  // Mapear H/M a Hombre/Mujer para la UI
  const displaySex = formData.Sex === "H" ? "Hombre" : formData.Sex === "M" ? "Mujer" : "";

  const handleSaveProfile = async () => {
    // Concatenar los campos de dirección antes de validar y guardar
    const direccion = [
      formData.Calle || "",
      formData.Colonia || "",
      formData.CodigoPostal || "",
      formData.NumeroInterior || "",
      formData.NumeroExterior || "",
    ].join(";");
    const updatedFormData = { ...formData, Direccion: direccion };

    const errors = validateForm(updatedFormData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      if (!user) {
        throw new Error("Usuario no cargado");
      }
      if (!user.huesped) {
        const personaResponse = await fetch(`${API_BASE_URL}/api/personas`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nombre: formData.Nombre,
            SegundoNombre: formData.SegundoNombre,
            Apellido_Paterno: formData.Apellido_Paterno,
            Apellido_Materno: formData.Apellido_Materno,
            Fecha_Nacimiento: formData.Fecha_Nacimiento,
            Edad: parseInt(formData.Edad),
            Sex: formData.Sex, // Enviará H o M
            Celular: formData.Celular || null,
            Correo: formData.Correo,
            Direccion: direccion || null,
            FK_Ciudad: parseInt(formData.FK_Ciudad),
            FK_Estatus_Bloqueo: 6,
          }),
        });
        if (personaResponse.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!personaResponse.ok) {
          throw new Error(`Error ${personaResponse.status}: ${await personaResponse.text()}`);
        }
        const persona = await personaResponse.json();
        const huespedResponse = await fetch(`${API_BASE_URL}/api/huespedes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            FK_Persona: persona.Id_Persona,
            FK_UserAlta: user.Id_Usuario,
            FechaAlta: new Date().toISOString(),
          }),
        });
        if (huespedResponse.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!huespedResponse.ok) {
          throw new Error(`Error ${huespedResponse.status}: ${await huespedResponse.text()}`);
        }
        const usuarioResponse = await fetch(`${API_BASE_URL}/api/usuarios/${user.Id_Usuario}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            FK_Persona: persona.Id_Persona,
          }),
        });
        if (usuarioResponse.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!usuarioResponse.ok) {
          throw new Error(`Error ${usuarioResponse.status}: ${await usuarioResponse.text()}`);
        }
      } else {
        const personaResponse = await fetch(
          `${API_BASE_URL}/api/personas/${user.huesped.persona.Id_Persona}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Nombre: formData.Nombre,
              SegundoNombre: formData.SegundoNombre,
              Apellido_Paterno: formData.Apellido_Paterno,
              Apellido_Materno: formData.Apellido_Materno,
              Fecha_Nacimiento: formData.Fecha_Nacimiento,
              Edad: parseInt(formData.Edad),
              Sex: formData.Sex, // Enviará H o M
              Celular: formData.Celular || null,
              Correo: formData.Correo,
              Direccion: direccion || null,
              FK_Ciudad: parseInt(formData.FK_Ciudad),
            }),
          }
        );
        if (personaResponse.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!personaResponse.ok) {
          throw new Error(`Error ${personaResponse.status}: ${await personaResponse.text()}`);
        }
      }
    } catch (err: any) {
      console.error("Error al guardar perfil:", err);
      setError(err.message || "Error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            {user?.huesped ? "Actualiza tu información personal" : "Registra tu información para continuar"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Nombre">Nombre *</Label>
              <Input
                id="Nombre"
                value={formData.Nombre}
                onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                placeholder="Nombre"
              />
              {formErrors.Nombre && <p className="text-red-500 text-sm">{formErrors.Nombre}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="SegundoNombre">Segundo Nombre</Label>
              <Input
                id="SegundoNombre"
                value={formData.SegundoNombre}
                onChange={(e) => setFormData({ ...formData, SegundoNombre: e.target.value })}
                placeholder="Segundo Nombre"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Apellido_Paterno">Apellido Paterno *</Label>
              <Input
                id="Apellido_Paterno"
                value={formData.Apellido_Paterno}
                onChange={(e) => setFormData({ ...formData, Apellido_Paterno: e.target.value })}
                placeholder="Apellido Paterno"
              />
              {formErrors.Apellido_Paterno && (
                <p className="text-red-500 text-sm">{formErrors.Apellido_Paterno}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Apellido_Materno">Apellido Materno *</Label>
              <Input
                id="Apellido_Materno"
                value={formData.Apellido_Materno}
                onChange={(e) => setFormData({ ...formData, Apellido_Materno: e.target.value })}
                placeholder="Apellido Materno"
              />
              {formErrors.Apellido_Materno && (
                <p className="text-red-500 text-sm">{formErrors.Apellido_Materno}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Fecha_Nacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="Fecha_Nacimiento"
                type="date"
                value={formData.Fecha_Nacimiento}
                onChange={(e) => setFormData({ ...formData, Fecha_Nacimiento: e.target.value })}
              />
              {formErrors.Fecha_Nacimiento && (
                <p className="text-red-500 text-sm">{formErrors.Fecha_Nacimiento}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Edad">Edad *</Label>
              <Input
                id="Edad"
                type="number"
                value={formData.Edad}
                readOnly
                placeholder="Edad (calculada automáticamente)"
              />
              {formErrors.Edad && <p className="text-red-500 text-sm">{formErrors.Edad}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Sex">Sexo *</Label>
              <Select
                value={displaySex}
                onValueChange={(value) =>
                  setFormData({ ...formData, Sex: value === "Hombre" ? "H" : "M" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hombre">Hombre</SelectItem>
                  <SelectItem value="Mujer">Mujer</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.Sex && <p className="text-red-500 text-sm">{formErrors.Sex}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Pais">País *</Label>
              <Select
                value={formData.Pais}
                onValueChange={(value) => {
                  setFormData({ ...formData, Pais: value });
                  fetchEstados(value, setEstados, setFormData, formData, setCiudades, setError);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {paises.map((pais) => (
                    <SelectItem key={pais} value={pais}>
                      {pais}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.Pais && <p className="text-red-500 text-sm">{formErrors.Pais}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Estado">Estado *</Label>
              <Select
                value={formData.Estado}
                onValueChange={(value) => {
                  setFormData({ ...formData, Estado: value });
                  fetchCiudades(formData.Pais, value, setCiudades, setFormData, formData, setError);
                }}
                disabled={!formData.Pais}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.Estado && <p className="text-red-500 text-sm">{formErrors.Estado}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="FK_Ciudad">Ciudad *</Label>
              <Select
                value={formData.FK_Ciudad}
                onValueChange={(value) => setFormData({ ...formData, FK_Ciudad: value })}
                disabled={!formData.Estado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.ID_Ciudad} value={ciudad.ID_Ciudad.toString()}>
                      {ciudad.Ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.FK_Ciudad && <p className="text-red-500 text-sm">{formErrors.FK_Ciudad}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="Calle">Calle</Label>
            <Input
              id="Calle"
              value={formData.Calle}
              onChange={(e) => setFormData({ ...formData, Calle: e.target.value })}
              placeholder="Calle"
            />
            {formErrors.Calle && <p className="text-red-500 text-sm">{formErrors.Calle}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="Colonia">Colonia</Label>
            <Input
              id="Colonia"
              value={formData.Colonia}
              onChange={(e) => setFormData({ ...formData, Colonia: e.target.value })}
              placeholder="Colonia"
            />
            {formErrors.Colonia && <p className="text-red-500 text-sm">{formErrors.Colonia}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="CodigoPostal">Código Postal</Label>
              <Input
                id="CodigoPostal"
                value={formData.CodigoPostal}
                onChange={(e) => setFormData({ ...formData, CodigoPostal: e.target.value })}
                placeholder="Código Postal"
              />
              {formErrors.CodigoPostal && (
                <p className="text-red-500 text-sm">{formErrors.CodigoPostal}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="NumeroInterior">Número Interior</Label>
              <Input
                id="NumeroInterior"
                value={formData.NumeroInterior}
                onChange={(e) => setFormData({ ...formData, NumeroInterior: e.target.value })}
                placeholder="Número Interior"
              />
              {formErrors.NumeroInterior && (
                <p className="text-red-500 text-sm">{formErrors.NumeroInterior}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="NumeroExterior">Número Exterior</Label>
              <Input
                id="NumeroExterior"
                value={formData.NumeroExterior}
                onChange={(e) => setFormData({ ...formData, NumeroExterior: e.target.value })}
                placeholder="Número Exterior"
              />
              {formErrors.NumeroExterior && (
                <p className="text-red-500 text-sm">{formErrors.NumeroExterior}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Celular">Celular</Label>
              <Input
                id="Celular"
                value={formData.Celular}
                onChange={(e) => setFormData({ ...formData, Celular: e.target.value })}
                placeholder="Celular (10 dígitos)"
              />
              {formErrors.Celular && <p className="text-red-500 text-sm">{formErrors.Celular}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Correo">Correo *</Label>
              <Input
                id="Correo"
                type="email"
                value={formData.Correo}
                onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
                placeholder="Correo electrónico"
              />
              {formErrors.Correo && <p className="text-red-500 text-sm">{formErrors.Correo}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? "Guardando..." : user?.huesped ? "Guardar Cambios" : "Registrar Perfil"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}