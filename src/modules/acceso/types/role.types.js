/**
 * @typedef {Object} Permiso
 * @property {number} id
 * @property {string} clave
 * @property {string} descripcion
 */

/**
 * @typedef {Object} Role
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {Permiso[]} permisos  Permisos asociados (objetos {id, clave, descripcion}).
 */

/** Valores iniciales para el formulario de creación de un rol. */
export const RoleSchema = {
  id: '',
  nombre: '',
  descripcion: '',
  permisos: [],
}
