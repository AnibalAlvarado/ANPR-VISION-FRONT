# Documentación de la carpeta `shared`

La carpeta `shared` contiene recursos reutilizables en toda la aplicación, como componentes, directivas, pipes y servicios que pueden ser utilizados por diferentes módulos.

## Estructura de la carpeta

- **components/**  
  Contiene componentes reutilizables como diálogos, botones personalizados, tablas, etc.

- **directives/**  
  Incluye directivas personalizadas que agregan comportamiento a los elementos del DOM.

- **pipes/**  
 Transforman datos en plantillas. Son útiles para:

- Mostrar fechas con formato personalizado

- Cortar textos largos con puntos suspensivos

- Convertir números o strings en representaciones amigables


- **models/**  
  Interfaces y modelos de datos utilizados en toda la aplicación.

## Descripción de cada carpeta

### components/
Aquí se encuentran los componentes visuales reutilizables.  
**Ejemplo:**  
- `dialog/` – Componente para mostrar mensajes o confirmaciones al usuario.
- `loader/` – Indicador de carga reutilizable.
- `custom-button/` – Botón personalizado con estilos y funcionalidades comunes.

### directives/
Directivas personalizadas para manipular el DOM o agregar validaciones.  
**Ejemplo:**  
- auto-focus.directive.ts – Para enfocar automáticamente un input.

- click-outside.directive.ts – Detecta clics fuera de un elemento (útil para modales/menús).

- has-permission.directive.ts – Oculta/muestra elementos según permisos.

- debounce-click.directive.ts – Para evitar clicks múltiples rápidos.

- lazy-load.directive.ts – Carga perezosa de elementos al hacer scroll.



### pipes/
Transformadores de datos para las vistas.  
**Ejemplo:**  
- truncate.pipe.ts – Corta texto con ... si excede un límite.

- date-format.pipe.ts – Formatea fechas de forma estandarizada.

- capitalize.pipe.ts – Capitaliza texto.

- bytes.pipe.ts – Convierte bytes a KB/MB/GB.

- status-color.pipe.ts – Devuelve un color según estado.


### models/
Interfaces y clases para tipado de datos.  
**Ejemplo:**  
- `user.model.ts` – Modelo de usuario.
- `response.model.ts` – Modelo genérico para respuestas de API.

### providers.ts/

Aquí puedes centralizar todos los providers comunes que no dependan de lógica de negocio.

---


