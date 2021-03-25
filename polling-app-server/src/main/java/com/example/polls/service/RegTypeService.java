//package com.example.polls.service;
//
//import com.example.polls.model.user.RegType;
//import com.example.polls.model.user.RegTypeName;
//import com.example.polls.model.user.User;
//import com.example.polls.repository.RegTypeRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//import java.util.Set;
//
//@Service
//
//public class RegTypeService {
//    RegTypeRepository regTypeRepository;
//    public RegTypeService(RegTypeRepository regTypeRepository){
//        this.regTypeRepository = regTypeRepository;
//    }
//
//    public Set<RegType> getUserRegType(RegTypeName name) {
//        Optional<RegType> regType = regTypeRepository.findByName(name);
//        return regType;
//    }
//}
