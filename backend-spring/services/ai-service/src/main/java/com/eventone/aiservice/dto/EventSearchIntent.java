package com.eventone.aiservice.dto;
import java.util.List;
public class EventSearchIntent {
    private List<String> keywords;
    private List<String> categories;
    private String location;
    private String dateFrom;
    private String dateTo;
    private Integer maxPrice;
    
    // Getters / Setters
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDateFrom() { return dateFrom; }
    public void setDateFrom(String dateFrom) { this.dateFrom = dateFrom; }
    public String getDateTo() { return dateTo; }
    public void setDateTo(String dateTo) { this.dateTo = dateTo; }
    public Integer getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Integer maxPrice) { this.maxPrice = maxPrice; }
}
