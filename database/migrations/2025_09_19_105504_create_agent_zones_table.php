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
        Schema::create('agent_zones', function (Blueprint $table) {
            $table->bigIncrements('agent_zone_id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('zone_id');
            $table->foreign('agent_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('zone_id')->references('zone_id')->on('zones')->onDelete('cascade');
            $table->unsignedBigInteger('branch_id')->after('zone_id');

            $table->foreign('branch_id')->references('branch_id')->on('branches')->cascadeOnDelete()->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_zones');
    }
};
