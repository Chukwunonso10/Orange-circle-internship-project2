"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import ExpenseTable from "./expenses/expense-table";
import ViewExpenseModal from "./expenses/view-modal";
import EditExpenseModal from "./expenses/edit-modal";
import DeleteExpenseModal from "./expenses/delete-modal";

interface ExpenseItem {
  id: string;
  description?: string | null;
  category: string;
  amount: any;
  createdAt: string | Date;
}

interface ExpenseCardProps {
  expense?: ExpenseItem[];
}

/**
 * ExpenseCard Component (Orchestrator)
 * 
 * Production-style Container Component.
 * Instead of embedding form fields, dialog markups, and tables in one place,
 * this component acts as the coordinator/controller.
 * 
 * Responsibilities:
 * 1. Manages state for list tracking (`localExpenses`).
 * 2. Manages references to active modals (`viewExpense`, `editExpense`, `deleteExpense`).
 * 3. Handles background network communications (deletions, refreshes).
 * 4. Pass properties and action callbacks downstream to modular sub-components.
 */
export default function ExpenseCard({ expense = [] }: ExpenseCardProps) {
  const router = useRouter();

  // Local state for optimistic updates
  const [localExpenses, setLocalExpenses] = useState<ExpenseItem[]>(expense);

  // State controllers for which modal is active and for which item
  const [viewExpense, setViewExpense] = useState<ExpenseItem | null>(null);
  const [editExpense, setEditExpense] = useState<ExpenseItem | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<ExpenseItem | null>(null);

  // Network activities
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep local items synchronized when page props update
  useEffect(() => {
    setLocalExpenses(expense);
  }, [expense]);

  // Callback triggered when the child Edit Modal successfully updates a record
  function handleEditSuccess(updatedExpense: ExpenseItem) {
    setLocalExpenses(prev =>
      prev.map(item => (item.id === updatedExpense.id ? updatedExpense : item))
    );
    router.refresh();
  }

  // Callback triggered when the child Delete Modal confirms deletion execution
  async function handleDeleteConfirm() {
    if (!deleteExpense) return;
    const id = deleteExpense.id;

    // Snapshot list for rollback
    const previousExpenses = [...localExpenses];

    // Optimistically update list state immediately
    setLocalExpenses(prev => prev.filter(item => item.id !== id));
    setDeletingId(id);
    setDeleteExpense(null); // Close confirmation modal immediately

    try {
      const response = await fetch(`/api/routes/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Expense deleted successfully!");
        router.refresh();
      } else {
        // Rollback state if backend returns error
        setLocalExpenses(previousExpenses);
        toast.error(result.message || "Failed to delete expense.");
      }
    } catch (error) {
      console.error("Delete expense error:", error);
      // Rollback state if network request fails
      setLocalExpenses(previousExpenses);
      toast.error("Network error: Could not delete expense.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* 1. Presentational Grid Table */}
      <ExpenseTable
        expenses={localExpenses}
        onView={setViewExpense}
        onEdit={setEditExpense}
        onDelete={setDeleteExpense}
        deletingId={deletingId}
      />

      {/* 2. Details Viewer Modal (Mounted on Demand) */}
      {viewExpense && (
        <ViewExpenseModal
          expense={viewExpense}
          onClose={() => setViewExpense(null)}
        />
      )}

      {/* 3. Form Editor Modal (Mounted on Demand) */}
      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          isOpen={true}
          onClose={() => setEditExpense(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* 4. Warning Delete Confirmation Modal (Mounted on Demand) */}
      {deleteExpense && (
        <DeleteExpenseModal
          expense={deleteExpense}
          onClose={() => setDeleteExpense(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={deletingId === deleteExpense.id}
        />
      )}
    </>
  );
}
