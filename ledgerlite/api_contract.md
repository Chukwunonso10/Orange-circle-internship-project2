# LedgerLite API Contract v1.0

### Base URL: `/api`
---
## 1. Product (Item) Endpoints

### GET `/items`
Fetches all products sorted alphabetically.
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid-v4-item-id",
          "name": "Apples",
          "currentStock": 20,
          "lowStockThreshold": 5,
          "updatedAt": "2026-07-08T12:00:00Z"
        }
      ]
    }
    ```

### POST `/items`
Creates a new product or upserts stock limits.
*   **Request Body:**
    ```json
    {
      "id": "uuid-v4-item-id",
      "name": "Apples",
      "current_stock": 20,
      "low_stock_threshold": 5
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "data": { "id": "uuid-v4-item-id", "name": "Apples" }
    }
    ```

---

## 2. Sales Endpoints

### POST `/sales`
Logs a new sale. Validates stock limit before saving.
*   **Request Body:**
    ```json
    {
      "id": "uuid-v4-generated-by-client", 
      "item_id": "uuid-or-null",
      "custom_item_name": "Apples",
      "quantity": 2,
      "unit_price": 5.50,
      "created_at": "2026-07-07T12:00:00Z"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": "uuid-v4-generated-by-client",
        "total_amount": 11.00
      }
    }
    ```
*   **Response (400 Bad Request - Insufficient Stock):**
    ```json
    {
      "error": "Insufficient stock. Only 1 items are available."
    }
    ```

---

## 2. Report Summary

### GET `/reports/summary`
Calculates daily/weekly summaries for the dashboard charts.
*   **Query Params:** `range` (values: `daily` or `weekly`)
*   **Response (200 OK):**
    ```json
    {
      "summary": {
        "total_income": 1500.00,
        "total_expense": 450.00,
        "net_profit": 1050.00
      },
      "chart_data": [
        { "label": "Mon", "income": 200, "expense": 50 },
        { "label": "Tue", "income": 150, "expense": 100 }
      ]
    }
    ```