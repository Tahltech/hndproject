<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Zone extends Model
{
    use HasFactory;

    protected $primaryKey = 'zone_id';

    protected $fillable = ['branch_id', 'name'];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id', 'branch_id');
    }

    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'agent_zones', 'zone_id', 'agent_id');
    }
}
