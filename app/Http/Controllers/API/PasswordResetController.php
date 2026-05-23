<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:usuarios,email',
        ]);

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetUrl = "http://localhost/reset-password?token=$token&email={$request->email}";

        Mail::send('emails.reset', ['url' => $resetUrl], function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Recuperar contraseña - Fitt-y-Nova');
        });

        return response()->json(['message' => 'Email enviado correctamente']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|exists:usuarios,email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Token inválido o expirado'], 422);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            return response()->json(['message' => 'El enlace ha expirado'], 422);
        }

        Usuario::where('email', $request->email)->update([
            'password_hash' => Hash::make($request->password),
        ]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}