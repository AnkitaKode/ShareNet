package com.platform.ShareNet.service;

import com.platform.ShareNet.model.Transaction;
import com.platform.ShareNet.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionForUser(Long userId){
        return transactionRepository.findByUserId(userId);
    }

    public Transaction saveTransaction(Transaction transaction){
        return transactionRepository.save(transaction);
    }


}
