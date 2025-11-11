<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'transaction_id';

    protected $fillable = [
        'account_id', 'agent_id', 'type', 'method', 'amount', 'status', 'reference_no', 'remarks'
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id', 'account_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id', 'user_id');
    }

    public function loanRepayment(): HasOne
    {
        return $this->hasOne(LoanRepayment::class, 'transaction_id', 'transaction_id');
    }
}
