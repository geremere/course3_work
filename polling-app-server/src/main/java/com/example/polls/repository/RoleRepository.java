package com.example.polls.repository;

import com.example.polls.model.user.Role;
import com.example.polls.model.user.TypeName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(TypeName roleName);
}
