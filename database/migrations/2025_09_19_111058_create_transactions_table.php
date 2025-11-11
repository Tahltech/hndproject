<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Constraint\Constraint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('transaction_id');
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('agent_id')->NULL;
            $table->enum('type', ['deposit', 'withdrawal']);       
            $table->enum('method', ['cash', 'mtn_momo', 'orange_money']); // Payment method
            $table->decimal('amount', 12, 2);                      // Amount: 12 digits, 2 decimals
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending'); // Transaction status
            $table->string('reference_no',100)->NULL;
            $table->text('remarks')->NULL;
            $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
            $table->foreign('agent_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
