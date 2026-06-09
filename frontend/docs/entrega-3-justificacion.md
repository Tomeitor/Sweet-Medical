# Entrega 3 · Justificación de requerimientos no funcionales

## Interfaz intuitiva
- Se incorporó una navegación principal persistente con accesos directos a Inicio, Buscar turnos, Preselección y Cómo funciona.
- La pantalla de búsqueda está organizada por pasos: filtros, resultados y resumen de preselección.
- Los textos explican qué dato debe cargar la persona usuaria y por qué.

## Aprendizaje rápido
- El flujo usa patrones familiares de ecommerce: listado de resultados, tarjetas comparables y resumen lateral tipo carrito.
- La home y la página "Cómo funciona" explican el recorrido completo para reducir fricción en el primer uso.

## Feedback visual y notificaciones
- Se agregaron mensajes de error y éxito para búsquedas, carga inicial de catálogos y operaciones de preselección.
- Durante las solicitudes al backend se muestran skeletons y textos de carga.
- Los resultados usan `aria-live` para anunciar cambios de estado a tecnologías asistivas.

## Diseño responsivo
- Se usaron grillas fluidas que colapsan a una sola columna en tablet y mobile.
- Botones, selects e inputs mantienen altura mínima táctil y espaciados legibles en pantallas chicas.

## Accesibilidad
- Se agregó skip link, foco visible, semántica HTML, labels asociados y navegación por teclado.
- Los colores elegidos tienen contraste alto sobre fondos claros.
- Los mensajes dinámicos usan roles y regiones vivas (`role="alert"`, `role="status"`, `aria-live`).

## Consistencia en la UI
- La aplicación usa un sistema único de tokens visuales (colores, radios, sombras y espaciados) definido en `src/index.css`.
- Los botones, paneles, tarjetas, alerts y etiquetas reutilizan estilos y patrones compartidos.

## Integración con backend
- Se integra `GET /api/v1/medicos` para construir filtros dinámicos de médicos, especialidades, prácticas y sedes.
- Se integra `GET /api/v1/turnos/disponibles` para la búsqueda real de turnos.
- Se usa Axios como cliente HTTP, con manejo homogéneo de errores.

## Carrito / preselección frontend
- La preselección se implementa completamente del lado cliente mediante contexto de React.
- Permite agregar múltiples turnos, visualizarlos, eliminarlos y vaciar la selección.
- La información se conserva en `localStorage`, por lo que sigue viviendo únicamente en el frontend.

## Observación importante
- El backend actual no expone un endpoint de pacientes; por eso el frontend ofrece los pacientes demo compatibles con el repositorio mock (`1` y `2`) para que la búsqueda integrada funcione de punta a punta.
