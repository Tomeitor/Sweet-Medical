# Documentación del proyecto Sweet Medical - Grupo 2 

## 🚀 ¿Cómo levantar la aplicación?

Siga estos pasos para configurar y ejecutar el entorno de desarrollo local:

### 1. Instalación de dependencias
Es necesario descargar los módulos de Node.js antes de iniciar. Ejecute en la terminal:
```bash
npm install
```

### 2. Configuración de variables de entorno
Cree un archivo llamado .env en la raíz del proyecto (donde se encuentra el package.json) y configure las siguientes variables:

Fragmento de código
```bash
PORT=3000
PATH_APP=/api/v1
```

### 3. Ejecución del servidor

Inicia el servidor con Node directamente.
```bash
npm start
```
## Uso y Endpoints
Una vez que el servidor esté corriendo (por defecto en http://localhost:3000), puede verificar el estado de la API mediante el Healthcheck:

```bas
GET http://localhost:3000/api/v1/healthcheck
```

Para probar la lógica de negocio (Turnos, Médicos, Disponibilidades), se recomienda importar la colección de Postman y utilizar los prefijos configurados en el router.

## 🧪 Pruebas Automatizadas (Tests)
El proyecto incluye una suite de tests unitarios y de integración desarrollados con Jest. Para ejecutarlos, asegúrese de que la carpeta node_modules esté presente y corra:

```bash
npm test
```



### Links utiles

* [Link enunciado (Entrega 1)](https://docs.google.com/document/d/1rWljImX3OHWDQuxLNox3pQCseW1LBoNFpuH7n3U_FWA/edit?tab=t.0)
* [Documentacion de Zod (Validador de datos de entrada)](https://zod.dev/)
* [Documentacion JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
* [Documentacion Express](https://expressjs.com/es/)

### Forma de trabajo

La idea es crear una rama *dev* a partir de la rama *main*, a partir de la misma creamos las diferentes ramas de features.
Todas las tareas a realizar se encuentran en el apartado de **[Issues](https://github.com/ddsw-man/2026-1c-backend-grupo-02/issues)** y tambien en la seccion de **[Project](https://github.com/orgs/ddsw-man/projects/3)**

Al finalizar las features haremos un merge a la rama dev, y al finalizar la entrega hariamos una pull request a la rama main para la correción.

En cuanto a la organizacion de las carpetas, vamos a usar una arquitectura de capas, donde tendremos un archivo controller, route, service y repository.
