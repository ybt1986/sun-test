package com.example.demo.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;

import org.apache.log4j.Logger;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;

import com.yahoo.platform.yui.compressor.CssCompressor;
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

/**
 * JS、CSS压缩工具
 * 
 *
 */
public class CompressorUtils {
   private final static Logger logger = Logger.getLogger(CompressorUtils.class);

   public static void compressJS(File js, Writer out) throws IOException {
      compressJS(js, out, -1, true, true, false, false);
   }

   public static void compressJS(File js, Writer out, int linebreakpos, boolean munge, boolean verbose,
         boolean preserveAllSemiColons, boolean disableOptimizations) throws IOException {
      try (InputStreamReader in = new InputStreamReader(new FileInputStream(js), "UTF-8");) {
         JavaScriptCompressor compressor = new JavaScriptCompressor(in, new ErrorReporter() {

            public void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
               if (logger.isInfoEnabled()) {
                  logger.warn("\n[WARNING] in " + js.getAbsolutePath());
               }
               if (line < 0) {
                  if (logger.isInfoEnabled()) {
                     logger.warn("  " + message);
                  }
               } else {
                  if (logger.isInfoEnabled()) {
                     logger.warn("  " + line + ':' + lineOffset + ':' + message);
                  }
               }
            }

            public void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
               if (logger.isInfoEnabled()) {
                  logger.error("[ERROR] in " + js.getAbsolutePath());
               }
               if (line < 0) {
                  if (logger.isInfoEnabled()) {
                     logger.error("  " + message);
                  }
               } else {
                  if (logger.isInfoEnabled()) {
                     logger.error("  " + line + ':' + lineOffset + ':' + message);
                  }
               }
            }

            public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource,
                  int lineOffset) {
               error(message, sourceName, line, lineSource, lineOffset);
               return new EvaluatorException(message);
            }
         });

         compressor.compress(out, linebreakpos, munge, verbose, preserveAllSemiColons, disableOptimizations);
      }
   }

   public static void compressCSS(File css, Writer out) throws Exception {
      compressCSS(css, out, -1);
   }

   public static void compressCSS(File css, Writer out, int linebreakpos) throws IOException {
      try (InputStreamReader in = new InputStreamReader(new FileInputStream(css), "UTF-8");) {
         CssCompressor compressor = new CssCompressor(in);

         compressor.compress(out, linebreakpos);
      }
   }
}
