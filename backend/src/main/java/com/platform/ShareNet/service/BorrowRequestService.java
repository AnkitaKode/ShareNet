package com.platform.ShareNet.service;

import com.platform.ShareNet.model.BorrowRequest;
import com.platform.ShareNet.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowRequestService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    public BorrowRequest createBorrowRequest(BorrowRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        request.setStatus("PENDING");
        return borrowRequestRepository.save(request);
    }

    public List<BorrowRequest> getUserRequests(Long userId) {
        return borrowRequestRepository.findAllByUserId(userId);
    }

    public BorrowRequest updateRequestStatus(Long requestId, String status) {
        Optional<BorrowRequest> requestOpt = borrowRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            BorrowRequest request = requestOpt.get();
            request.setStatus(status);
            request.setUpdatedAt(LocalDateTime.now());
            return borrowRequestRepository.save(request);
        }
        return null;
    }

    public List<BorrowRequest> getPendingRequestsForOwner(Long ownerId) {
        return borrowRequestRepository.findByStatus("PENDING").stream()
                .filter(req -> req.getOwnerId().equals(ownerId))
                .toList();
    }

    public BorrowRequest getRequestById(Long requestId) {
        return borrowRequestRepository.findById(requestId).orElse(null);
    }

    public List<BorrowRequest> getRequestsByBorrower(Long borrowerId) {
        return borrowRequestRepository.findByBorrowerId(borrowerId);
    }

    public List<BorrowRequest> getRequestsByOwner(Long ownerId) {
        return borrowRequestRepository.findByOwnerId(ownerId);
    }
}
