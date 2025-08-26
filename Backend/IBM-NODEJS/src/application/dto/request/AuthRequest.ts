import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRequest {
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password: string;
  
  constructor(username: string = '', password: string = '') {
    this.username = username;
    this.password = password;
  }
}
