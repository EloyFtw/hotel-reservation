import Image from "next/image"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Hotel Del Ángel" width={150} height={60} />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Inicio
            </Link>
            <Link href="/hotels" className="text-sm font-medium hover:underline underline-offset-4">
              Sucursales
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              Nosotros
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Link href="/login">
                <span className="text-sm font-medium hover:underline underline-offset-4">Iniciar Sesión</span>
              </Link>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12 md:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Política de Privacidad</h1>
                <p className="mt-4 text-muted-foreground">Última actualización: 15 de mayo de 2025</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introducción</h2>
                <p>
                  En Hotel Del Ángel, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo
                  recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestro sitio
                  web y servicios. Al acceder o utilizar nuestros servicios, usted acepta las prácticas descritas en
                  esta política.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. Información que Recopilamos</h2>
                <h3 className="text-xl font-semibold">2.1 Información Personal</h3>
                <p>Podemos recopilar los siguientes tipos de información personal:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Información de contacto:</strong> Nombre, dirección de correo electrónico, número de
                    teléfono, dirección postal.
                  </li>
                  <li>
                    <strong>Información de reservación:</strong> Fechas de estancia, preferencias de habitación, número
                    de huéspedes, solicitudes especiales.
                  </li>
                  <li>
                    <strong>Información de pago:</strong> Datos de tarjetas de crédito/débito, información de
                    facturación.
                  </li>
                  <li>
                    <strong>Información de identificación:</strong> Número de pasaporte o identificación oficial, fecha
                    de nacimiento, nacionalidad (requeridos por ley para el registro de huéspedes).
                  </li>
                  <li>
                    <strong>Información de cuenta:</strong> Nombre de usuario, contraseña, preferencias de comunicación.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold">2.2 Información Automática</h3>
                <p>
                  Cuando visita nuestro sitio web, podemos recopilar automáticamente cierta información, incluyendo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Información técnica:</strong> Dirección IP, tipo de navegador, proveedor de servicios de
                    Internet, páginas de referencia/salida, sistema operativo.
                  </li>
                  <li>
                    <strong>Información de uso:</strong> Páginas visitadas, tiempo de permanencia en el sitio, clics en
                    enlaces, patrones de navegación.
                  </li>
                  <li>
                    <strong>Cookies y tecnologías similares:</strong> Utilizamos cookies y tecnologías similares para
                    mejorar su experiencia en nuestro sitio web. Para más información, consulte nuestra Política de
                    Cookies.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. Cómo Utilizamos su Información</h2>
                <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Procesar y confirmar sus reservaciones</li>
                  <li>Proporcionar y personalizar nuestros servicios</li>
                  <li>Procesar pagos y prevenir fraudes</li>
                  <li>Comunicarnos con usted sobre su reservación o cuenta</li>
                  <li>Enviar información sobre promociones y ofertas especiales (si ha dado su consentimiento)</li>
                  <li>Mejorar nuestro sitio web y servicios</li>
                  <li>Cumplir con requisitos legales y regulatorios</li>
                  <li>Resolver disputas y solucionar problemas</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Base Legal para el Procesamiento</h2>
                <p>Procesamos su información personal basándonos en las siguientes bases legales:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Ejecución de un contrato:</strong> Cuando procesamos su información para proporcionar los
                    servicios que ha solicitado o para cumplir con nuestras obligaciones contractuales.
                  </li>
                  <li>
                    <strong>Consentimiento:</strong> Cuando nos ha dado su consentimiento explícito para procesar su
                    información para un propósito específico, como el envío de comunicaciones de marketing.
                  </li>
                  <li>
                    <strong>Intereses legítimos:</strong> Cuando el procesamiento es necesario para nuestros intereses
                    legítimos, como la prevención de fraudes o la mejora de nuestros servicios.
                  </li>
                  <li>
                    <strong>Obligación legal:</strong> Cuando estamos obligados por ley a procesar su información, como
                    para el registro de huéspedes o para fines fiscales.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Compartir Información</h2>
                <p>Podemos compartir su información personal con las siguientes categorías de destinatarios:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a proporcionar nuestros
                    servicios, como procesadores de pago, proveedores de servicios de TI, y servicios de marketing.
                  </li>
                  <li>
                    <strong>Sucursales de Hotel Del Ángel:</strong> Compartimos información entre nuestras sucursales
                    para proporcionar un servicio coherente y personalizado.
                  </li>
                  <li>
                    <strong>Socios comerciales:</strong> Cuando es necesario para proporcionar servicios que ha
                    solicitado, como servicios de transporte o excursiones.
                  </li>
                  <li>
                    <strong>Autoridades gubernamentales:</strong> Cuando estamos obligados por ley o en respuesta a
                    procesos legales.
                  </li>
                </ul>
                <p>
                  No vendemos su información personal a terceros. Cualquier tercero con el que compartimos su
                  información está obligado a mantener la confidencialidad y seguridad de sus datos.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Seguridad de la Información</h2>
                <p>
                  Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su
                  información personal contra acceso no autorizado, pérdida, mal uso o alteración. Estas medidas
                  incluyen:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encriptación de datos sensibles</li>
                  <li>Firewalls y sistemas de detección de intrusiones</li>
                  <li>Acceso restringido a la información personal</li>
                  <li>Monitoreo regular de nuestros sistemas para posibles vulnerabilidades</li>
                </ul>
                <p>
                  Aunque nos esforzamos por proteger su información, ningún método de transmisión por Internet o
                  almacenamiento electrónico es 100% seguro. Por lo tanto, no podemos garantizar su seguridad absoluta.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Retención de Datos</h2>
                <p>
                  Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos para
                  los que fue recopilada, incluyendo el cumplimiento de requisitos legales, contables o de informes. El
                  período de retención específico depende del tipo de información y su propósito.
                </p>
                <p>
                  Para determinar el período de retención apropiado, consideramos la cantidad, naturaleza y sensibilidad
                  de la información personal, el riesgo potencial de daño por uso o divulgación no autorizados, los
                  propósitos para los que procesamos la información y si podemos lograr esos propósitos a través de
                  otros medios.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Sus Derechos</h2>
                <p>
                  Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, que
                  incluyen:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Derecho de acceso:</strong> Puede solicitar una copia de la información personal que tenemos
                    sobre usted.
                  </li>
                  <li>
                    <strong>Derecho de rectificación:</strong> Puede solicitar que corrijamos información inexacta o
                    incompleta.
                  </li>
                  <li>
                    <strong>Derecho de eliminación:</strong> En ciertas circunstancias, puede solicitar que eliminemos
                    su información personal.
                  </li>
                  <li>
                    <strong>Derecho a restringir el procesamiento:</strong> Puede solicitar que restrinjamos el
                    procesamiento de su información en ciertas circunstancias.
                  </li>
                  <li>
                    <strong>Derecho a la portabilidad de datos:</strong> Puede solicitar que transfiramos su información
                    a otra organización o directamente a usted.
                  </li>
                  <li>
                    <strong>Derecho a oponerse:</strong> Puede oponerse al procesamiento de su información personal en
                    ciertas circunstancias.
                  </li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, por favor contáctenos utilizando la información
                  proporcionada en la sección "Contacto" a continuación. Responderemos a su solicitud dentro de los
                  plazos establecidos por las leyes aplicables.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">9. Transferencias Internacionales de Datos</h2>
                <p>
                  Hotel Del Ángel opera principalmente en México, pero puede transferir, almacenar y procesar su
                  información en países distintos a su país de residencia. Estos países pueden tener leyes de protección
                  de datos diferentes a las de su país.
                </p>
                <p>
                  Cuando transferimos información a países que pueden no proporcionar el mismo nivel de protección de
                  datos que su país de residencia, implementamos medidas de seguridad apropiadas para garantizar que su
                  información personal reciba un nivel adecuado de protección, como cláusulas contractuales estándar o
                  mecanismos de certificación aprobados.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Menores</h2>
                <p>
                  Nuestros servicios no están dirigidos a personas menores de 18 años y no recopilamos intencionalmente
                  información personal de menores. Si es padre o tutor y cree que su hijo nos ha proporcionado
                  información personal, por favor contáctenos para que podamos tomar las medidas necesarias.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. Cambios a esta Política</h2>
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras
                  prácticas de información o requisitos legales. La versión actualizada se publicará en nuestro sitio
                  web con la fecha de "última actualización" revisada. Le recomendamos revisar esta política
                  regularmente.
                </p>
                <p>
                  Los cambios significativos serán notificados a través de un aviso prominente en nuestro sitio web o
                  por correo electrónico, cuando sea apropiado.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">12. Contacto</h2>
                <p>
                  Si tiene preguntas, comentarios o solicitudes relacionadas con esta Política de Privacidad o el
                  procesamiento de su información personal, por favor contáctenos a:
                </p>
                <ul className="list-disc pl-6">
                  <li>Correo electrónico: privacidad@hoteldelangel.com</li>
                  <li>Teléfono: +52 (55) 1234 5678</li>
                  <li>
                    Dirección: Av. Paseo de la Reforma 222, Piso 15, Col. Juárez, 06600, La Paz, B.C.S., México
                    Atención: Oficial de Privacidad
                  </li>
                </ul>
                <p>
                  Haremos todo lo posible para resolver cualquier inquietud que pueda tener de manera oportuna y justa.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">13. Autoridad de Protección de Datos</h2>
                <p>
                  Si no está satisfecho con nuestra respuesta a su inquietud, tiene derecho a presentar una queja ante
                  la autoridad de protección de datos correspondiente. En México, puede contactar al Instituto Nacional
                  de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Hotel Del Ángel" width={150} height={60} />
            </Link>
            <p className="text-sm text-muted-foreground">© 2025 Hotel Del Ángel. Todos los derechos reservados.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium hover:underline underline-offset-4">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
