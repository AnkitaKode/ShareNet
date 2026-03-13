package com.platform.ShareNet.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long itemId;
    private Long borrowerId;
    private Long ownerId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // PENDING, APPROVED, REJECTED, COMPLETED
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
