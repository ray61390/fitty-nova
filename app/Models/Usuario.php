<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'rol_id',
        'nombre',
        'apellidos',
        'email',
        'password_hash',
        'avatar_url',
        'telefono',
        'activo',
        'email_verified',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function rol()
    {
        return $this->belongsTo(Rol::class);
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}