<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserKyc extends Model
{

     protected $primaryKey = 'kyc_id';

    protected $fillable = [
        'user_id',
        'passport_photo',
        'id_card_front',
        'id_card_back',
        'proof_of_address',
        'status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
