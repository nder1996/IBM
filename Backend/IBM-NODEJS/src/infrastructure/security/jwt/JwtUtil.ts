import jwt from "jsonwebtoken";
import { Service, LogMethod } from "../../aspect/LoggingAspect";

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta";
const JWT_EXPIRES_IN = "1h";

@Service()
export class JwtUtil {
  @LogMethod()
  generateToken(username: string): string {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  @LogMethod()
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}
