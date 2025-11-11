<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loan_repayments', function (Blueprint $table) {
            $table->bigIncrements('repayment_id');
            $table->unsignedBigInteger('loan_id');
            $table->unsignedBigInteger('transaction_id');
            $table->decimal('amount',12,2);
            $table->timestamp('paid_on');
            $table->foreign('loan_id')->references('loan_id')->on('loans')->onDelete('cascade');
            $table->foreign('transaction_id')->references('transaction_id')->on('transactions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_repayments');
    }
};
