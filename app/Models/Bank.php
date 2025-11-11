<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    use HasFactory;

    protected $primaryKey = 'bank_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'address',
        'contact_number',
        'email',
    ];

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class, 'bank_id', 'bank_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'bank_id', 'bank_id');
    }
}
