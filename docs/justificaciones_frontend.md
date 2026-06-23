# Justificaciones de diseño del Frontend

## Interfaz intuitiva y aprendizaje rápido

### Flujo principal y happy path

En esta entrega, lo primero que ve el usuario al entrar a la página es una pantalla de bienvenida donde explica brevemente el uso de la misma y le da la opción de empezar a utilizarla.
Si decide buscar los turnos disponibles, pasa a otra pantalla donde tiene un buscador al que se le pueden aplicar filtros de búsqueda según sede, especialidad fechas, etc. Si no quiere aplicara filtros puede aplicar filtros. Una vez que obtiene los turnos que busca puede "preseleccionarlas" para luego en la siguiente pantalla del mismo nombre donde puede reservar los turnos o seguir buscando por más opciones.

### Decisiones y Patrones

La página de inicio tiene un patrón de navegación Scroll para darle una presentación al usuario del contenido de la página y sus servicios. El contenido de la presentación está dispuesto teniendo en cuenta el patrón de lectura F, donde el usuario primero lee el título más grande, luego sus ojos van hacia la derecha donde están las razones por las que se debe elegir esta página, y finalmente su mirada se dirige al botón de "Buscar turnos".

Para la página de búsqueda de turnos se utiliza el patrón de interacción de búsqueda, con su barra correspondiente. Dentro de la misma tiene un texto placeholder para que le sirva de guía a un usuario sin experiencia en la página de qué se puede ingresar para acotar la búsqueda. El botón "Filtros" que abre la solapa de filtros tiene un ícono usado comúnmente en otras páginas para que sea reconocible. Se tiene un paginado de los turnos disponibles para reducir la carga cognitiva del usuario con tanto contenido y que tampoco que scrollear hasta el fondo de la pantalla.

En la página de Preselección, se utiliza un patrón de navegación por cartas para tener una división clara de las secciones dentro de la pantalla. En el carrito de turnos figuran todos los turnos que el usuario seleccionó como una lista.

En caso de que un usuario más experimentado quiera ir directamente a alguna página, cuenta con accesos directos dentro del pie de página.

## Feedback visual y notificaciones de interfaz

Para que el usuario sepa en todo momento el estado de sus turnos, cuenta con una accion accesible en la parte derecha de la barra de navegación donde se indican cuántos turnos tiene preseleccionados.

En caso de que el usuario ingrese a una URL que no es parte de los flujos programados, se lo envía a una pantalla de error donde se detalla la razón del mismo y se le da la posibilidad de volver a la página de Inicio o de Buscar Turnos.

## Diseño responsive

El diseño de las pantallas es adaptable al ancho de ventana que tenga el usuario. Por ejemplo, en la pantalla de preselección, las cartas de Preselección y Resumen están dispuestas de forma horizontal por defecto, pero si se achica la pantalla cambian a una disposición vertical.

## Accesibilidad

Los componentes de mayor importancia tienen un mayor tamaño según la Ley de Fitts sobre la relación entre el tamaño y la importancia de un componente UI. Y cada texto sigue una jerarquía de tamaño siguiendo su importancia dentro de cada pantalla.

El propio texto en las pantallas es breve y claro, sin lenguaje de nicho (ya sea médico o de desarrollo) para que el usuario pueda entender sin problema qué función cumple cada componente.

Para los usuarios que tengan algún impedimento visual, los componentes tienen un etiquetado descriptivo a su función y también cuentan con atributos de Aria para los lectores de pantalla. Por ej:
```html
<footer className="app-footer" aria-label="Pie de Página">...</footer>
```
Donde el propio uso de la etiqueta indica su tipo de sección y dónde puede estar ubicado. Y en caso de estar utilizando Aria está indicado qué etiqueta és.

Todas las pantallas son navegables con teclado por medio de Tab, y está señalado con un foco en pantalla el componente donde se ubica el usuario actualmente.

El colores elegidos para el texto de énfasis (#c2252d) y el usado en el fondo (#ffffff) tienen una razón contraste de 5,33:1. Por lo que pasan las pruebas de legibilidad AA y AAA en textos grandes y la AA en textos de tamaño normal, según lo marca la WCAG.

## Consistencia visual

Cada pantalla reutiliza los componentes de la barra de navegación y el pie de página.