import Image from "next/image"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Términos y Condiciones</h1>
                <p className="mt-4 text-muted-foreground">Última actualización: 15 de mayo de 2025</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introducción</h2>
                <p>
                  Bienvenido a Hotel Del Ángel. Estos Términos y Condiciones rigen el uso de nuestro sitio web y
                  servicios. Al acceder o utilizar nuestro sitio web, usted acepta estar sujeto a estos términos. Si no
                  está de acuerdo con alguna parte de estos términos, no podrá acceder al sitio web ni utilizar nuestros
                  servicios.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. Definiciones</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>"Nosotros", "nuestro" o "Hotel Del Ángel"</strong> se refiere a Hoteles Del Ángel S.A. de
                    C.V., una empresa constituida bajo las leyes de México.
                  </li>
                  <li>
                    <strong>"Sitio web"</strong> se refiere a hoteldelangel.com y todas sus páginas y servicios.
                  </li>
                  <li>
                    <strong>"Usuario", "usted" o "cliente"</strong> se refiere a cualquier persona que acceda o utilice
                    nuestro sitio web o servicios.
                  </li>
                  <li>
                    <strong>"Servicios"</strong> se refiere a todos los servicios ofrecidos por Hotel Del Ángel,
                    incluyendo pero no limitado a reservaciones, alojamiento, y servicios adicionales.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. Reservaciones</h2>
                <h3 className="text-xl font-semibold">3.1 Proceso de Reservación</h3>
                <p>
                  Las reservaciones pueden realizarse a través de nuestro sitio web, por teléfono, correo electrónico o
                  agencias de viajes autorizadas. Para confirmar una reservación, se requiere una tarjeta de crédito
                  válida o un depósito según las políticas específicas de cada sucursal.
                </p>

                <h3 className="text-xl font-semibold">3.2 Garantía de Reservación</h3>
                <p>
                  Todas las reservaciones están sujetas a disponibilidad. Una reservación se considera garantizada una
                  vez que se ha recibido la confirmación por escrito de Hotel Del Ángel y se ha procesado el depósito o
                  la información de la tarjeta de crédito.
                </p>

                <h3 className="text-xl font-semibold">3.3 Modificaciones y Cancelaciones</h3>
                <p>
                  Las políticas de modificación y cancelación varían según la tarifa y la sucursal. En general, las
                  cancelaciones realizadas con al menos 48 horas de anticipación a la fecha de llegada no tendrán
                  penalización. Las cancelaciones tardías o no presentaciones (no-show) pueden resultar en cargos
                  equivalentes a una o más noches de estancia.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Check-in y Check-out</h2>
                <p>
                  El horario de check-in es a partir de las 15:00 horas y el check-out es hasta las 12:00 horas. El
                  check-in anticipado y el check-out tardío están sujetos a disponibilidad y pueden generar cargos
                  adicionales.
                </p>
                <p>
                  Para el check-in, todos los huéspedes deben presentar una identificación oficial con fotografía y la
                  tarjeta de crédito utilizada para la reservación (si aplica).
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Tarifas y Pagos</h2>
                <h3 className="text-xl font-semibold">5.1 Tarifas</h3>
                <p>
                  Todas las tarifas se muestran en Pesos Mexicanos (MXN) e incluyen impuestos aplicables, a menos que se
                  indique lo contrario. Las tarifas pueden variar según la temporada, disponibilidad y promociones
                  especiales.
                </p>

                <h3 className="text-xl font-semibold">5.2 Cargos Adicionales</h3>
                <p>
                  Algunos servicios o amenidades pueden generar cargos adicionales que no están incluidos en la tarifa
                  base. Estos servicios pueden incluir, pero no se limitan a: estacionamiento, servicio a la habitación,
                  minibar, spa, y actividades recreativas.
                </p>

                <h3 className="text-xl font-semibold">5.3 Métodos de Pago</h3>
                <p>
                  Aceptamos las principales tarjetas de crédito y débito, transferencias bancarias y efectivo (solo para
                  pagos en la propiedad). Para reservaciones en línea, se requiere una tarjeta de crédito válida.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Políticas de la Propiedad</h2>
                <h3 className="text-xl font-semibold">6.1 Política de No Fumar</h3>
                <p>
                  Todas nuestras sucursales son 100% libres de humo. Fumar dentro de las habitaciones o áreas no
                  designadas resultará en un cargo por limpieza profunda de al menos $2,000 MXN.
                </p>

                <h3 className="text-xl font-semibold">6.2 Política de Mascotas</h3>
                <p>
                  Las políticas sobre mascotas varían según la sucursal. Algunas sucursales permiten mascotas con un
                  cargo adicional y restricciones específicas. Por favor, consulte directamente con la sucursal antes de
                  su llegada.
                </p>

                <h3 className="text-xl font-semibold">6.3 Conducta del Huésped</h3>
                <p>
                  Los huéspedes deben comportarse de manera respetuosa hacia otros huéspedes y el personal. El hotel se
                  reserva el derecho de solicitar la salida de cualquier huésped que cause molestias, daños o no cumpla
                  con las políticas del hotel, sin reembolso.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Responsabilidad y Limitaciones</h2>
                <p>
                  Hotel Del Ángel no se hace responsable por la pérdida, robo o daño de objetos personales en cualquier
                  área del hotel. Se recomienda utilizar las cajas de seguridad disponibles en las habitaciones o en la
                  recepción.
                </p>
                <p>
                  Nuestra responsabilidad por daños está limitada a casos de negligencia grave o conducta dolosa. No
                  somos responsables por circunstancias fuera de nuestro control, incluyendo pero no limitado a
                  desastres naturales, huelgas, o acciones gubernamentales.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Propiedad Intelectual</h2>
                <p>
                  Todo el contenido del sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes,
                  clips de audio, descargas digitales y compilaciones de datos, es propiedad de Hotel Del Ángel o sus
                  proveedores de contenido y está protegido por las leyes de propiedad intelectual.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">9. Modificaciones a los Términos</h2>
                <p>
                  Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las
                  modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Es
                  responsabilidad del usuario revisar periódicamente estos términos.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Ley Aplicable y Jurisdicción</h2>
                <p>
                  Estos Términos y Condiciones se rigen por las leyes de México. Cualquier disputa relacionada con estos
                  términos será sometida a la jurisdicción exclusiva de los tribunales de La Paz, Baja California Sur.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. Contacto</h2>
                <p>Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de:</p>
                <ul className="list-disc pl-6">
                  <li>Correo electrónico: legal@hoteldelangel.com</li>
                  <li>Teléfono: +52 (55) 1234 5678</li>
                  <li>Dirección: Av. Paseo de la Reforma 222, Piso 15, Col. Juárez, 06600, La Paz, Baja California Sur, México</li>
                </ul>
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
            <Link href="/terms" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
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
