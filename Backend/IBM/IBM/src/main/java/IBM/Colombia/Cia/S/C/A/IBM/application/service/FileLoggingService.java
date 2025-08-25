package IBM.Colombia.Cia.S.C.A.IBM.application.service;


import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class FileLoggingService {
    private static final String LOG_FILE_PATH = "src/main/resources/logs/transactions.txt";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void writeTransactionLog(String transactionId, String message) {
        try (FileWriter fw = new FileWriter(LOG_FILE_PATH, true);
             PrintWriter pw = new PrintWriter(fw)) {

            String timestamp = LocalDateTime.now().format(formatter);
            pw.println(String.format("[%s] TXN[%s] - %s", timestamp, transactionId, message));

        } catch (IOException e) {
            System.err.println("❌ Error escribiendo log a archivo: " + e.getMessage());
        }
    }

    public void writeTransactionStart(String transactionId, String method, String uri, String ip, Map<String, String[]> parameters, Map<String, String> headers) {
        StringBuilder message = new StringBuilder();
        message.append(String.format("🚀 START | %s %s | IP: %s", method, uri, ip));
        message.append("\nParameters: ").append(parameters);
        message.append("\nHeaders: ").append(headers);
        writeTransactionLog(transactionId, message.toString());
    }

    public void writeTransactionEnd(String transactionId, int status, long duration, String user, String responseBody, Map<String, String> responseHeaders) {
        String icon = status >= 400 ? "❌" : "✅";
        StringBuilder message = new StringBuilder();
        message.append(String.format("%s END | Status: %d | Duration: %dms | User: %s", icon, status, duration, user));
        message.append("\nResponse Body: ").append(responseBody);
        message.append("\nResponse Headers: ").append(responseHeaders);
        writeTransactionLog(transactionId, message.toString());
    }
}
