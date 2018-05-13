package com.suncht.sample.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.suncht.sample.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}