<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    use HasFactory;

    protected $primaryKey = 'loan_id';

    protected $fillable = [
        'account_id',
        'principal_amount',
        'interest_rate',
        'repayment_period',
        'status',
        'loan_purpose',
        'id_number',
        'address',
        'g_full_name',
        'g_email',
        'g_phone',
        'g_id_number',
        'g_address',
    ];

    /**
     * Relationship to account
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id', 'account_id');
    }

    /**
     * Relationship to repayments
     */
    public function repayments(): HasMany
    {
        return $this->hasMany(LoanRepayment::class, 'loan_id', 'loan_id');
    }
}
