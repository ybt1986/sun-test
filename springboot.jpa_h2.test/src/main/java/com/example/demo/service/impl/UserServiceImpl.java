package com.example.demo.service.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private UserRepository userRepository;

	@Override
	public User getUserById(Long id) {
		return userRepository.findOne(id);
	}

	public Page<User> getUserByCondition(int pageNo, int pageSize) {
		PageRequest pageRequest = new PageRequest(pageNo, pageSize);

		Specification<User> specification = new Specification<User>() {
			@Override
			public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				Predicate p1 = cb.like(root.get("id").as(String.class), "%" + "1" + "%");
				Predicate p2 = cb.equal(root.get("userName").as(String.class), "sd");
				Predicate p3 = cb.like(root.get("email").as(String.class), "%s%");
				// 构建组合的Predicate示例：
				Predicate p = cb.and(p3, cb.or(p1, p2));

				return p;
			}

		};
		
		Page<User> page = userRepository.findAll(specification, pageRequest);
		return page;
	}
	
	/**
     * 建立分页排序请求 
     * @param page
     * @param size
     * @return
     */
    private PageRequest buildPageRequest(int page, int size) {
          Sort sort = new Sort(Direction.DESC,"createTime");
          return new PageRequest(page,size, sort);
    }
}
