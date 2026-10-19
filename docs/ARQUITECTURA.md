# Arquitectura de JaleaSec

Web comercial estática HTML/CSS/JS → WhatsApp. Seis páginas con enlaces relativos, datos editoriales en `apps/web/data`, mensaje en `lib/request.js` y animación opcional en `lib/reveal.js`. Sin API comercial, cuentas, pagos ni base de leads.

El build compila el workspace `@jaleasec/campus-planner`, copia la web a `dist/web`, incluye la demo en `demos/campus-planner/` y escribe `health.json` con producto y commit. Cloudflare Pages debe publicar exclusivamente ese directorio desde la raíz del dominio. El favicon raíz y el logo usan JaleaSec.

Campus Planner usa dominio en `packages/core`, validación estricta de copias, CSV neutralizado y un repositorio Preferences. Android usa almacenamiento nativo; la demo usa almacenamiento del navegador. La interfaz se habilita tras cargar el estado y persiste antes de actualizarlo. Sin service worker, PWA, servidor o sincronización.

La clave actual es `jaleasec.campusplanner.v1`. Si no existe, el repositorio detecta una única clave anterior con el sufijo `.campusplanner.v1`, valida el contenido y lo guarda antes de devolverlo. No borra la fuente ni mezcla copias. Una copia inválida, ambigua o un fallo de escritura interrumpe la migración.

Android usa `pe.jaleasec.campusplanner`, `MainActivity.java` en el paquete correspondiente y el recurso `jaleasec_icon`. Cambiar el appId implica otra instalación; las copias JSON permiten traslado manual de datos entre aplicaciones u orígenes. No se han comprobado instalación y firma nativas en esta máquina.

Backend FastAPI/SQLAlchemy es futuro y está deshabilitado para la web. Roles y sesión son contratos opcionales, sin login ni permisos de servidor operativos.

Los archivos de Docker/Nginx son una alternativa no aplicada a producción: usan `/jaleasec/`, health en `/jaleasec/health.json` y recursos locales con nombre JaleaSec. No controlan Cloudflare Pages. Ver `MIGRACION-JALEASEC.md` antes de cualquier publicación.
