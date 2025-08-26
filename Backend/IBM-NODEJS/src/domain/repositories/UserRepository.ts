import fs from 'fs';
import path from 'path';
import { Repository, Timed } from '../../infrastructure/aspect/LoggingAspect';


@Repository()
export class UserRepository {
    private usersFilePath: string;
    
    constructor() {
        this.usersFilePath = path.join(process.cwd(), 'src', 'infrastructure', 'resources', 'properties', 'users.json');
    }
    
    
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
    

    @Timed()
    public async findAll(): Promise<any[]> {
        try {
            return await this.loadUsers();
        } catch (error) {
            console.error('Error al cargar todos los usuarios:', error);
            throw error;
        }
    }
    
  
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


export default new UserRepository();
