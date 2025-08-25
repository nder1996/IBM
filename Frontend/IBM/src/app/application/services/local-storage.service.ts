import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Almacena un valor en el localStorage con una clave específica.
   * @param key - Clave bajo la cual se almacenará el valor
   * @param value - Valor a almacenar (se serializará a JSON)
   * @returns `true` si la operación fue exitosa, `false` en caso de error
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error al guardar en localStorage para la clave "${key}":`, error);
      return false;
    }
  }

  /**
   * Recupera un valor del localStorage.
   * @param key - Clave del valor a recuperar
   * @param defaultValue - Valor por defecto a devolver si la clave no existe
   * @returns El valor almacenado o el valor por defecto si no existe
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);

      if (item === null) {
        return defaultValue;
      }

      // Intenta parsear el valor como JSON
      try {
        return JSON.parse(item) as T;
      } catch {
        // Si falla el parsing, devuelve el valor en crudo
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error al recuperar del localStorage para la clave "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Recupera un valor del localStorage con verificación de tipo.
   * @param key - Clave del valor a recuperar
   * @param typeGuard - Función para verificar el tipo del valor
   * @param defaultValue - Valor por defecto a devolver si la clave no existe o el tipo no coincide
   * @returns El valor almacenado si pasa la verificación de tipo, o el valor por defecto
   */
  getItemWithTypeCheck<T>(
    key: string,
    typeGuard: (value: unknown) => value is T,
    defaultValue: T | null = null
  ): T | null {
    const value = this.getItem<unknown>(key);

    if (value === null || !typeGuard(value)) {
      return defaultValue;
    }

    return value;
  }

  /**
   * Elimina un elemento del localStorage.
   * @param key - Clave del elemento a eliminar
   * @returns `true` si la operación fue exitosa, `false` en caso de error
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar del localStorage para la clave "${key}":`, error);
      return false;
    }
  }

  /**
   * Limpia todo el contenido del localStorage.
   * @returns `true` si la operación fue exitosa, `false` en caso de error
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar el localStorage:', error);
      return false;
    }
  }

  /**
   * Obtiene las claves almacenadas en el localStorage.
   * @returns Array de claves o array vacío en caso de error
   */
  getKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error al obtener las claves del localStorage:', error);
      return [];
    }
  }

  /**
   * Verifica si una clave existe en el localStorage.
   * @param key - Clave a verificar
   * @returns `true` si la clave existe, `false` en caso contrario o en caso de error
   */
  hasKey(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error al verificar la clave "${key}" en el localStorage:`, error);
      return false;
    }
  }

  /**
   * Obtiene la cantidad de elementos almacenados en el localStorage.
   * @returns Número de elementos o 0 en caso de error
   */
  getLength(): number {
    try {
      return localStorage.length;
    } catch (error) {
      console.error('Error al obtener la longitud del localStorage:', error);
      return 0;
    }
  }

  /**
   * Almacena un valor con fecha de expiración.
   * @param key - Clave bajo la cual se almacenará el valor
   * @param value - Valor a almacenar
   * @param expiresIn - Tiempo de expiración en milisegundos
   * @returns `true` si la operación fue exitosa, `false` en caso de error
   */
  setItemWithExpiry<T>(key: string, value: T, expiresIn: number): boolean {
    const now = new Date().getTime();
    const item = {
      value,
      expiry: now + expiresIn
    };

    return this.setItem(key, item);
  }

  /**
   * Recupera un valor almacenado con fecha de expiración.
   * @param key - Clave del valor a recuperar
   * @returns El valor si existe y no ha expirado, o `null` en caso contrario
   */
  getItemWithExpiry<T>(key: string): T | null {
    const item = this.getItem<{ value: T; expiry: number }>(key);

    if (item === null) {
      return null;
    }

    const now = new Date().getTime();

    // Si el elemento ha expirado, lo eliminamos y devolvemos null
    if (now > item.expiry) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  }
}
