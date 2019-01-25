package com.example.demo.controller;

import com.google.common.base.Splitter;
import com.google.common.collect.Maps;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

/**
 * @author sunchangtan
 * @date 2018/11/4 20:17
 */
@Controller
@RequestMapping("/cmp")
public class CmpController {
    @RequestMapping("/compress")
    public Map<String, Object> compress(String files, String type) {
        List<String> fileList = Splitter.on(',').omitEmptyStrings().trimResults().splitToList(files);
        System.out.println(fileList);

        return Maps.newHashMap();
    }
}
