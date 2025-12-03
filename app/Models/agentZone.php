<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class agentZone extends Model
{
    /** @use HasFactory<\Database\Factories\AgentZoneFactory> */
    use HasFactory;
    protected $primaryKey = 'agent_zone_id';

    protected $fillable = [
        'agent_id',
        'zone_id',

    ];

    public function agents(): BelongsTo {
        return $this->belongsTo(User::class, 'agent_id', 'user_id');
    }
    public function zones(): BelongsTo {
        return $this->belongsTo(Zone::class, 'zone_id', 'zone_id');
    }
}
