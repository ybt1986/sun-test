package com.suncht.sample.test;

import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import com.suncht.sample.model.User;
import com.suncht.sample.service.UserRepository;

@SpringBootTest
@RunWith(SpringRunner.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void saveTest() throws Exception {
        User user = new User();
        user.setUserName("suncht");
        user.setAge(31);
        User result = userRepository.save(user);
        Assert.notNull(user.getId(), "aa");
    }

    @Test
    public void findOneTest() throws Exception{
        Optional<User> user = userRepository.findById(1L);
        System.out.println(user.get());
    }
}