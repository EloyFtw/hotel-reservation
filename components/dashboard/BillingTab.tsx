import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BillingTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facturación</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturas</CardTitle>
          <CardDescription>Consulta y descarga tus facturas</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No disponible</AlertTitle>
            <AlertDescription>La funcionalidad de facturación no está implementada aún.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}