package IBM.Colombia.Cia.S.C.A.IBM.application.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Service
public class ImageBase64Service {
    public String getImageAsBase64(String resourcePath) {
        try {
            ClassPathResource imgFile = new ClassPathResource(resourcePath);
            try (InputStream is = imgFile.getInputStream()) {
                byte[] bytes = is.readAllBytes();
                String base64 = Base64.getEncoder().encodeToString(bytes);
                return "data:image/jpeg;base64," + base64;
            }
        } catch (IOException e) {
            return "";
        }
    }
}

