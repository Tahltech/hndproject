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
        Schema::create('branches', function (Blueprint $table) {
            $table->bigIncrements('branch_id');
            $table->unsignedBigInteger('bank_id');
            $table->string('name', 100)->NULL;
            $table->text('address', 200);
            $table->string('contact_number', 14);
            $table->text('email', 100);
            $table->foreign('bank_id')->references('bank_id')->on('banks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
