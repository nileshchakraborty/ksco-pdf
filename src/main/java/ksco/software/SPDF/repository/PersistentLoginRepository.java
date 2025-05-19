package ksco.software.SPDF.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ksco.software.SPDF.model.PersistentLogin;

@Repository
public interface PersistentLoginRepository extends JpaRepository<PersistentLogin, String> {
    void deleteByUsername(String username);
}
