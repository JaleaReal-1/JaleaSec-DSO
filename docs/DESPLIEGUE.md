# Publicación de JaleaSec

El propietario utiliza Cloudflare Pages conectado a GitHub. La configuración vigente recomendada y la transferencia de dominio se documentan en [Migración](MIGRACION-JALEASEC.md).

- Repositorio: `JaleaReal-1/JaleaSec-DSO`.
- Producción: `main`.
- Raíz: repositorio completo.
- Build: `npm run build`.
- Salida: `dist/web`.
- Node: 22 o superior.

`dist/web/health.json` permite comparar el commit publicado con el build de Pages. Verificar título JaleaSec, favicon, catálogo, fichas, privacidad, contacto y demo antes de mover el dominio. No compartir claves ni subir carpetas privadas.

## Alternativa de contenedor, no aplicada

Docker/Nginx están preparados para servir `/jaleasec/`. El script `deploy/release.sh` solo acepta `/home/ec2-user/jaleasec/releases/<commit>`, valida el commit, comprueba un candidato en 127.0.0.1:8083 y actualiza un servicio independiente.

Estos nombres son configuración fuente para una instalación futura. No se han renombrado recursos existentes, movido carpetas remotas, ejecutado el script ni cambiado servidores. No ejecutar sobre un servidor anterior sin planificar primero el traslado de carpetas, puertos y recursos. Pages no utiliza Docker ni ese script.
