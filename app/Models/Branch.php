<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Branch extends Model
{
    use HasFactory;

    protected $primaryKey = 'branch_id';

    protected $fillable = [
        'bank_id', 'name', 'address', 'contact_number','email',
    ];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class, 'bank_id', 'bank_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'branch_id', 'branch_id');
    }

    public function zones(): HasMany
    {
        return $this->hasMany(Zone::class, 'branch_id', 'branch_id');
    }
}
