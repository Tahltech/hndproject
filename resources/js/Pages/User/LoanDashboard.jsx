import { useForm,Head } from "@inertiajs/react";
import React, { useState } from "react";
import { route } from "ziggy-js";
import Alertmessage from "../../Components/AlertMessage";

export default function Loanpage() {

const {post, error, setData, data}= useForm({
    amount: "",
})

const submitCheckballance = (e)=>{
    e.preventDefault()
    post(route("loan.store"))
}
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Head title="Loan"/>
       

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        
        {/* Header */}
         <Alertmessage />
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-5">
          Loan Checker
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Enter an amount to check your loan eligibility
        </p>

        
        <form className="space-y-5" onSubmit={submitCheckballance}>
          <div>
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={data.amount}
              onChange={(e) => setData("amount",e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              placeholder="Enter loan amount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            Check Eligibility
          </button>
        </form>
      </div>
    </main>
  );
}
