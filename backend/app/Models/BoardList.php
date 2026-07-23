<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardList extends Model
{
    use HasFactory;

    protected $table = 'lists';

    protected $fillable = ['board_id', 'title', 'position'];

    public function board()
    {
        return $this->belongsTo(Board::class, 'board_id');
    }

    public function cards()
    {
        return $this->hasMany(Card::class, 'list_id')->orderBy('position');
    }
}
