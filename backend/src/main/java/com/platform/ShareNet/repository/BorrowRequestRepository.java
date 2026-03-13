package com.platform.ShareNet.repository;

import com.platform.ShareNet.model.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    
    List<BorrowRequest> findByBorrowerId(Long borrowerId);
    
    List<BorrowRequest> findByOwnerId(Long ownerId);
    
    List<BorrowRequest> findByItemId(Long itemId);
    
    Optional<BorrowRequest> findByIdAndOwnerId(Long id, Long ownerId);
    
    Optional<BorrowRequest> findByIdAndBorrowerId(Long id, Long borrowerId);
    
    @Query("SELECT br FROM BorrowRequest br WHERE br.ownerId = :userId OR br.borrowerId = :userId ORDER BY br.createdAt DESC")
    List<BorrowRequest> findAllByUserId(@Param("userId") Long userId);
    
    @Query("SELECT br FROM BorrowRequest br WHERE br.status = :status ORDER BY br.createdAt DESC")
    List<BorrowRequest> findByStatus(@Param("status") String status);
}
