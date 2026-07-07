# LedgerLite API Contract v1.0

### Base URL: `/api`

---

## 1. Sales Endpoints

### POST `/sales`
Logs a new sale.
*   **Request Body:**
    ```json
    {
      "id": "cuid-generated-by-client", 
      "item_id": "cuid-or-null",
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
        "id": "cuid-generated-by-client",
        "total_amount": 11.00
      }
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