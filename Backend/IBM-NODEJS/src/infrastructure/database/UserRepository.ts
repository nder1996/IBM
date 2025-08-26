import fs from 'fs';
import path from 'path';
import { Repository, Timed } from '../aspect/LoggingAspect';

/**
 * Repositorio de usuarios con AOP aplicado
 * Utiliza el decorador @Repository para interceptar automáticamente todas las operaciones
 */
@Repository()
export class UserRepository {
    private usersFilePath: string;
    
    constructor() {
        this.usersFilePath = path.join(process.cwd(), 'src', 'infrastructure', 'resources', 'properties', 'users.json');
    }
    
    /**
     * Busca un usuario por nombre de usuario
     */
    public async findByUsername(username: string): Promise<any> {
        try {
            const users = await this.loadUsers();
            return users.find(user => 
                user && user.username && 
                user.username.toLowerCase() === username.toLowerCase()
            );
        } catch (error) {
            console.error('Error al buscar usuario por username:', error);
            throw error;
        }
    }
    
    /**
     * Lista todos los usuarios
     * Utiliza el decorador @Timed para medir específicamente el rendimiento
     */
    @Timed()
    public async findAll(): Promise<any[]> {
        try {
            return await this.loadUsers();
        } catch (error) {
            console.error('Error al cargar todos los usuarios:', error);
            throw error;
        }
    }
    
    /**
     * Carga los usuarios desde el archivo JSON
     */
    private async loadUsers(): Promise<any[]> {
        try {
            const data = await fs.promises.readFile(this.usersFilePath, 'utf8');
            const usersData = JSON.parse(data);
            return usersData.users || [];
        } catch (error) {
            console.error('Error al cargar el archivo de usuarios:', error);
            return [];
        }
    }
}

// Exportar una instancia por defecto
export default new UserRepository();
