package com.sample.suncht;

/**
 * @author sunchangtan
 * @date 2018/12/5 13:09
 */
public class Manacher {
    public static char[] manacherString(String str) {
        char[] charArray = str.toCharArray();
        char[] res = new char[2 * charArray.length + 1];
        for (int i = 0, index = 0; i < charArray.length; i++) {
            res[i] = (i % 2 == 1) ? '#' : charArray[index++];
        }

        return res;
    }

    public static void main(String[] args) {
        char[] chars = Manacher.manacherString("12345");
        System.out.println(chars);
    }
}
