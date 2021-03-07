package com.example.polls.repository;

import com.example.polls.model.user.RegType;
import com.example.polls.model.user.RegTypeName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RegTypeRepository extends JpaRepository<RegType,Long>{
    Optional<RegType> findByName(RegTypeName typeName);
}
