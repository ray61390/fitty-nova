<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:100',
            'apellidos' => 'nullable|string|max:150',
            'email'     => 'required|email|unique:usuarios,email',
            'password'  => 'required|string|min:6',
            'rol'       => 'nullable|in:cliente,vendedor',
        ]);

        $rolNombre = $request->rol === 'vendedor' ? 'vendedor' : 'cliente';
        $rol = Rol::where('nombre', $rolNombre)->first();

        $usuario = Usuario::create([
            'rol_id'        => $rol->id,
            'nombre'        => $request->nombre,
            'apellidos'     => $request->apellidos,
            'email'         => $request->email,
            'password_hash' => Hash::make($request->password),
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token'   => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('rol'));
    }
}
