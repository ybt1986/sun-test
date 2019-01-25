package com.sample.mybatis.test;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.*;

/**Request线程安全性测试
 * @author sunchangtan
 * @date 2019/1/25 10:07
 */
public class RequestSafeTest {
    public static void main(String[] args) throws Exception {
        BlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(2000);
        ThreadFactory threadFactory = Executors.defaultThreadFactory();
        ThreadPoolExecutor pool = new ThreadPoolExecutor(50, 50,
                0L, TimeUnit.MILLISECONDS,
                workQueue, threadFactory);

        String prefix = UUID.randomUUID().toString().replaceAll("-", "") + "::";
        for (int i = 0; i < 1000; i++) {
            final String value = prefix + i;
            pool.submit(()->{
                try {
                    CloseableHttpClient httpClient = HttpClients.createDefault();
                    HttpGet httpGet = new HttpGet("http://localhost:9090/test?key=" + value);
                    httpClient.execute(httpGet);
                    httpClient.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }

        pool.shutdown();
    }
}
