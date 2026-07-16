"use client"

import { useState } from "react"

export default function Home(){
  const [amount, setAmount]= useState("")
  const [description, setDescription]= useState("")
  const [category, setCategory]= useState("")
  const [loading, setLoading]= useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/routes/expenses", {
      method: "POST",
      body: JSON.stringify({amount, description, category})
    })
    const response = await res.json()
    setLoading(false)
    setAmount("")
    setCategory("")
    setDescription("")
    console.log(response)

  }


  return (
    <div className="min-h-screen w-screen bg-white flex items-center justify-center">
      <div className="bg-gray-300 rounded-md w-full max-w-md p-6">
        
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center"
        >
          <input
            type="text"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border p-2 rounded placeholder:text-black"
          />
  
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
  
          <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full border p-2 rounded"
          />
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}