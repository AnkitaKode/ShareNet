package com.platform.ShareNet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    private double pricePerDay;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private String category;

    @Column(name = "item_condition")
    private String condition;

    private String location;

    @Column(name = "is_available")
    private boolean available;

    private LocalDateTime availableUntil;
    private double latitude;
    private double longitude;

    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    // explicit getters/setters are optional with Lombok, but shown here
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setName(String string) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setImageUrl(String string) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setAvailable(boolean b) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setLongitude(double d) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setLatitude(double d) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setAvailableUntil(Object object) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setOwner(User owner) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}