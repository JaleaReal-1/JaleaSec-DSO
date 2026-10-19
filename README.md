# JaleaSec

Desarrollo de software a medida para negocios y universitarios de Juliaca, Perú. Marca digital independiente, atención online y proyectos con diseño e identidad propios. Hoy se ofrecen webs, portafolios, apps Android y sistemas pequeños; no servicios de ciberseguridad.

Repositorio: https://github.com/JaleaReal-1/JaleaSec-DSO
Dominio del propietario: https://jaleasec.tech

## Ejecutar y comprobar

Node.js 22 o superior y npm:

```powershell
npm ci
npm test
npm run build
npm run dev
```

Abrir http://127.0.0.1:4173/. El servidor sirve `dist/web`; recompilar después de editar. `npm run build` compila Campus Planner y después copia la web y la demo. No se publica el código fuente ni se necesita Python para la web.

## Cloudflare Pages

Conectar este repositorio, rama de producción `main`, framework `None`, comando `npm run build`, directorio de salida `dist/web` y raíz del repositorio sin subcarpeta. Usar `NODE_VERSION=22` o superior. No seleccionar `apps/web` ni `dist` como salida: el resultado publicable completo es `dist/web`.

La guía para crear el proyecto Pages y transferir el dominio está en [Migración](docs/MIGRACION-JALEASEC.md). El dominio no se conecta a GitHub directamente: apunta al proyecto de Pages, que compila desde GitHub. Los cambios de cuenta, DNS y asociación del dominio los realiza el propietario.

## Estructura

- `apps/web/`: seis páginas comerciales HTML/CSS/JS nativo, catálogo, contacto y mensajes.
- `apps/web/assets/jaleasec.svg` y `apps/web/favicon.svg`: identidad actual.
- `apps/mobile/campus-planner/`: demo individual offline, Vite y Capacitor 8.
- `packages/core/`: dominio, validación de copias y CSV.
- `tests/`: pruebas comerciales, navegación, dominio y migración de preferencias.
- `backend/`: esqueleto FastAPI futuro, sin almacenamiento de leads ni despliegue.
- `deploy/`, `compose.yaml`, `Dockerfile`: configuración alternativa de contenedor; no utilizada por Pages ni aplicada al servidor existente.

## Oferta y contacto

Catálogo y precios en `apps/web/data/catalog.js`; se conservan los ocho IDs y las referencias actuales sujetas a alcance. Web desde S/ 300 y desarrollo Android básico desde S/ 350. Portafolio a cotizar. Plazos y soporte se acuerdan por escrito; dominio, hosting e integraciones se evalúan aparte.

Contacto único en `apps/web/data/contact.js`: +51 938 888 511. El formulario genera una vista previa local, permite copiar y abre WhatsApp por acción explícita; no envía automáticamente ni guarda leads.

Campus Planner es la única demo funcional. Los demás registros son propuestas de desarrollo a medida; los mockups de negocio y portafolio son conceptos ficticios. No se inventan clientes ni proyectos entregados.

## Campus Planner y cambio de identidad

Cursos, horarios, tareas, exámenes, notas, JSON y CSV con almacenamiento local. Sin cuentas ni sincronización. Las copias no están cifradas; usar solo ejemplos ficticios en la demo pública. Máximo 500 registros por módulo.

Workspace: `@jaleasec/campus-planner`. Identificador Android: `pe.jaleasec.campusplanner`. Preferencias: `jaleasec.campusplanner.v1`.

La demo busca una clave anterior con el sufijo estable `.campusplanner.v1`, valida los datos y escribe en el nuevo espacio antes de continuar. Conserva la copia anterior. No elige entre múltiples copias ni mezcla datos. Cambiar de dominio/origen no transfiere el almacenamiento del navegador: usar exportación/restauración JSON.

Un APK con el nuevo appId se instala como otra aplicación; exportar JSON antes de reemplazar una instalación anterior. La compilación Android requiere SDK 36 y JDK 21; no se afirma haber compilado o instalado un APK en esta revisión.

```powershell
npm run android:sync
npm run android:open --workspace @jaleasec/campus-planner
```

## Documentación y archivos privados

[Arquitectura](docs/ARQUITECTURA.md), [Android](docs/ANDROID.md), [validación](docs/VALIDACION.md), [Tech Lab](docs/TECH-LAB.md).

Los planes y reportes anteriores están marcados como históricos y tienen sus nombres normalizados. No son instrucciones de despliegue activas. Credenciales, claves, keystores, `.env`, bases, dependencias y artefactos locales quedan fuera del repositorio y de `dist/web`.
