Trabaja sobre este repositorio: una app React 19 con Vite. Usa @tanstack/react-router
para el enrutado (src/routes/router.jsx), @tanstack/react-form, @tanstack/react-table
y axios. Es el sistema "SIGAC" (donaciones/beneficiarios). Hoy NO hay autenticación: la
app se muestra abierta y todos los datos se guardan en JSON Bin. Mi módulo es "Acceso y
Roles" y vive en src/modules/acceso/.

OBJETIVO: agregar autenticación con login/registro, manejo de sesión, control de acceso
por PERMISOS, y migrar el módulo "acceso" de JSON Bin a un backend REST.

El backend (ASP.NET Core, otro repo) expone esta API con prefijo /api. El JWT viaja en
Authorization: Bearer y lleva claims de id, email, rol y la lista de permisos:
- POST /api/auth/register  body { nombre, email, password } -> crea SIEMPRE rol "usuario",
  responde { token, usuario, permisos }
- POST /api/auth/login     body { email, password } -> { token, usuario, permisos }
- GET  /api/auth/me        -> usuario actual + permisos
- GET  /api/usuarios                 (permiso usuarios.ver)
- PATCH /api/usuarios/{id}/estado    (permiso usuarios.gestionar)
- PUT  /api/usuarios/{id}/rol        (permiso roles.asignar)
- GET  /api/roles                    (permiso roles.ver)
- POST /api/roles                    (permiso roles.gestionar)
- PUT  /api/roles/{id}               (permiso roles.gestionar)
- DELETE /api/roles/{id}             (permiso roles.gestionar)
- GET  /api/permisos                 (permiso roles.ver)

Modelo de permisos: los roles son paquetes de permisos atómicos. Permisos relevantes:
donaciones.crear, donaciones.ver, roles.ver, roles.asignar, roles.gestionar,
usuarios.ver, usuarios.gestionar, usuarios.crear_admin. Roles base: usuario (solo
donaciones.crear/ver), administrador (operativo, sin roles.*), superusuario (todo).

TAREAS:
1. Crear la URL base de la API desde variable de entorno VITE_API_URL (usar src/utils/env.js
   con la misma lógica de getEnv ya existente). Crear un cliente axios apiClient con un
   interceptor que adjunte "Authorization: Bearer <token>" y que ante respuesta 401 limpie
   la sesión y redirija a /login.
2. Crear un módulo de autenticación en src/modules/auth/:
   - services/authService.js (login, register, me).
   - context/AuthContext.jsx con un provider que mantenga { token, usuario, permisos },
     persista el token en localStorage, lo hidrate llamando a /api/auth/me al cargar, y
     exponga login(), register(), logout() y tienePermiso(clave).
   - hooks/useAuth.js para consumir el contexto.
   - pages/LoginPage.jsx y pages/RegistroPage.jsx (usa @tanstack/react-form, valida email
     y password no vacíos, muestra errores del backend). El registro crea SOLO usuarios
     normales; no incluyas selector de rol.
3. Enrutado: envolver la app con AuthProvider en src/main.jsx. Agregar rutas /login y
   /registro (sin el layout principal). Proteger el resto: si no hay sesión, redirigir a
   /login (usa beforeLoad de TanStack Router). Crear un guard por permiso para que la ruta
   /acceso solo sea accesible con permiso roles.gestionar o roles.asignar; si falta, mostrar
   una vista "Sin permiso".
4. Topbar (src/App.jsx): reemplazar el avatar fijo por el nombre del usuario logueado y un
   botón "Cerrar sesión" que llame a logout(). Ocultar el ítem de menú "Gestión de Acceso"
   si el usuario no tiene roles.gestionar/roles.asignar, y ocultar la acción de donar si no
   tiene donaciones.crear.
5. Migrar el módulo acceso de JSON Bin a la API:
   - Reemplazar src/services/accesoService.js para que use apiClient contra /api/roles,
     /api/permisos y /api/usuarios (no más jsonbinClient en este módulo).
   - Actualizar el hook src/Hooks/useRoles.js a la nueva forma (un rol ahora tiene
     id, nombre, descripcion y un arreglo de permisos).
   - Ampliar la página src/modules/acceso/pages/AccesoPage.jsx y sus componentes
     (RoleForm, RolesTable) para: gestionar roles CON sus permisos (checkboxes del catálogo
     de /api/permisos), listar usuarios y asignar rol a un usuario. La gestión de roles y la
     asignación deben mostrarse solo si tienePermiso lo permite.

RESTRICCIONES:
- No rompas los demás módulos (inventario, gastos, beneficiarios, donaciones); solo migra
  el de acceso. El resto puede seguir con JSON Bin por ahora.
- No guardes contraseñas ni secretos en el código. Mantén el estilo y convenciones del repo
  (nombres en español, componentes funcionales, hooks).
- Maneja estados de carga y error en las vistas nuevas.

Empieza proponiendo los archivos a crear/modificar y luego impleméntalos.