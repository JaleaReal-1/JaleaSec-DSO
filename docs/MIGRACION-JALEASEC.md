# Migración a JaleaSec-DSO — 19/10/2026

## Alcance realizado en el código

Repositorio nuevo: https://github.com/JaleaReal-1/JaleaSec-DSO.git

Se normalizan identidad, npm/workspace, Android/Java, iconos, backend futuro, configuración alternativa Docker/Nginx, rutas de pruebas y documentación. El favicon raíz y todos los enlaces de icono usan JaleaSec. Se elimina el SVG anterior sin referencias.

El nuevo repositorio se publica como una instantánea con historial propio para no arrastrar nombres antiguos en commits. El repositorio anterior no se borra ni se reescribe. El directorio local de trabajo y sus claves/archivos ignorados no se renombran ni se publican. La copia antigua del historial local queda disponible en las ramas previas.

Se conservan diseño, catálogo, precios, WhatsApp, formulario y dominio de Campus Planner. La nueva clave `jaleasec.campusplanner.v1` puede migrar una única copia anterior identificada por el sufijo `.campusplanner.v1`, validándola antes de persistir y sin borrar la fuente. No cruza orígenes ni aplicaciones Android. El nuevo appId Android exige instalación independiente y traslado por JSON cuando corresponda.

Los archivos Docker/Nginx ahora describen una instalación alternativa con nombres JaleaSec y prefijo `/jaleasec/`. Solo cambia su código: no se han ejecutado releases, cambiado servidores, movido recursos AWS ni cambiado DNS.

## Diagnóstico del dominio

El código comercial revisado ya mostraba JaleaSec antes de esta migración. No se pudo confirmar qué contenido sirve actualmente el dominio: el cliente HTTPS de este entorno y el navegador rechazan la autoridad del certificado. No se omitió la validación TLS ni se atravesó una advertencia de certificado.

El mensaje de otro chat o un favicon de Google puede venir de una versión/caché anterior; no demuestra cuál es el commit activo. Tras publicar en Pages, comparar `https://jaleasec.tech/health.json` con el commit del despliegue. Comprobar título, favicon y demo directamente. Las cachés externas no se actualizan al instante.

## Guía manual para Cloudflare Pages

Esta sección es para el propietario: no se realizan cambios en su cuenta.

### 1. Crear el nuevo proyecto

En Cloudflare: **Workers & Pages → Create application → Pages → Import an existing Git repository / Connect to Git**. Elegir `JaleaReal-1/JaleaSec-DSO`. Si no aparece, conceder acceso a ese repositorio desde la configuración de la aplicación GitHub de Cloudflare Pages.

Crear un proyecto Pages distinto, por ejemplo `jaleasec-dso` si el nombre está disponible. Así puede probarse sin sustituir primero el sitio actual.

| Ajuste | Valor |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | vacío / raíz del repositorio |
| Build command | `npm run build` |
| Build output directory | `dist/web` |
| Variable de entorno | `NODE_VERSION=22` (o una versión superior compatible) |

No usar `apps/web` como raíz de build: falta el workspace de la demo. No publicar `dist`, la raíz del repositorio ni fuentes. Pages instala dependencias y ejecuta el comando; la salida compilada es `dist/web`.

### 2. Probar antes de mover el dominio

Esperar estado de despliegue **Success**. Abrir la URL real `*.pages.dev` asignada por Cloudflare; comprobar home, Negocios, Universitarios, Proyectos, catálogo, ficha, privacidad, WhatsApp y `/demos/campus-planner/`. En `/health.json`, `product` debe ser JaleaSec y `commit` debe coincidir con el despliegue nuevo.

### 3. Transferir jaleasec.tech

Anotar la configuración DNS y el nombre del proyecto antiguo para poder restaurarlos. No borrar el proyecto antiguo.

Cuando el nuevo sitio esté validado, retirar la asociación `jaleasec.tech` del proyecto Pages anterior y su CNAME correspondiente siguiendo el flujo de Cloudflare. En el proyecto nuevo abrir **Custom domains → Set up a domain**, introducir `jaleasec.tech` y completar el asistente. Si el DNS ya está en Cloudflare, revisar/confirmar el registro que propone el asistente. Debe apuntar al hostname real del proyecto nuevo, no a GitHub.

Gestionar únicamente el registro web/Pages del dominio: no cambiar nameservers ni borrar MX/TXT u otros registros. Si existe `www.jaleasec.tech`, asociarlo también en Pages o conservar su redirección de forma explícita. Puede existir un breve intervalo de transferencia mientras se activa el dominio/certificado.

Esperar **Active** y HTTPS válido. Repetir las pruebas y comprobar `/health.json`. No basta con editar un CNAME: la asociación del dominio en Pages es obligatoria. Si falla, restaurar el registro/asociación anterior mientras se revisa el problema. Mantener el proyecto anterior hasta confirmar la transición.

### 4. Actualizaciones posteriores

Los push a `main` del nuevo repositorio activan producción cuando están habilitados los despliegues automáticos. La rama `codex/jaleasec-tech-lab` es de desarrollo; sus despliegues pueden ser de vista previa. El dominio pertenece al proyecto Pages, y ese proyecto es el que se conecta a GitHub.

## Fuentes oficiales

- [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Known issues](https://developers.cloudflare.com/pages/platform/known-issues/)

## Validación y límites

Validación local realizada: npm ci correcto; 16 pruebas correctas; npm run build correcto con el workspace nuevo. Se comprobó la ausencia de referencias anteriores en fuentes y build. El instalador informa tres avisos moderados en dependencias existentes; no se actualizan dependencias en esta migración. La compilación Android nativa, Docker/Nginx real y la transferencia del dominio no se consideran verificados por una compilación web. No se generó un QR en esta tarea: primero se normaliza y verifica la identidad del destino.
