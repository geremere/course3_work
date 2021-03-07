package com.example.polls.model.user;

import org.hibernate.annotations.NaturalId;
import javax.persistence.*;

@Entity
@Table(name = "regtypes")
public class RegType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(length = 60)
    private RegTypeName name;

    public RegType() {

    }

    public RegType(RegTypeName name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RegTypeName getName() {
        return name;
    }

    public void setName(RegTypeName name) {
        this.name = name;
    }

}
