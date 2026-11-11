# Validación de JaleaSec

Ejecutar `npm ci`, `npm test` y `npm run build` con Node 22 o superior. Abrir `npm run dev` para revisar el resultado compilado.

Las pruebas cubren catálogo, mensaje WhatsApp, enlaces y anclas desde raíz y `/jaleasec/`, dominio de Campus Planner, JSON, CSV y migración de preferencias entre espacios de nombres.

Revisar Inicio, Negocios, Universitarios, Proyectos, ficha válida e inválida, privacidad y demo. Comprobar filtros, menú por teclado, formulario mínimo, preselección, preview/copia, mensajes segmentados y movimiento reducido. No enviar mensajes externos durante las pruebas.

Verificar que el build contiene `favicon.png`, el logo actual, las fuentes locales y `health.json` con `product: JaleaSec` y el commit correcto. La oferta web debe mostrar únicamente «Desde S/ 599», con precio final según alcance. Comprobar la ausencia de campañas y restricciones geográficas antiguas. No deben aparecer denominaciones comerciales anteriores en archivos publicables ni dependencias/credenciales en `dist/web`.

Para Pages: comprobar el proyecto nuevo en su URL `pages.dev`, la configuración de build y el certificado del dominio antes del cambio. No modificar DNS ni borrar proyectos como parte de las pruebas locales.
