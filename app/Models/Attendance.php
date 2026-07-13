<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'date',
    'check_in_time',
    'check_out_time',
    'photo_check_in',
    'photo_check_out',
    'status',
])]
class Attendance extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}