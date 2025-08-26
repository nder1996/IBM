import fs from 'fs';
import path from 'path';
import { Service, LogMethod } from '../../infrastructure/aspect/LoggingAspect';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

@Service()
export class ImageBase64Service {
    @LogMethod()
    static convertImageToBase64(imagePath: string): string | null {
        try {
            const absolutePath = path.resolve(imagePath);
            const imageBuffer = fs.readFileSync(absolutePath);
            return imageBuffer.toString('base64');
        } catch (error) {
            return null;
        }
    }

    @LogMethod()
    static async convertImageToBase64Async(imagePath: string): Promise<string | null> {
        try {
            const absolutePath = path.resolve(imagePath);
            const imageBuffer = await readFileAsync(absolutePath);
            return imageBuffer.toString('base64');
        } catch (error) {
            return null;
        }
    }
}