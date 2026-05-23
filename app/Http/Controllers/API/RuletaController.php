<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RuletaController extends Controller
{
    public function puedeGirar(Request $request)
    {
        $usuarioId = $request->user()->id;

        $giroEsteMes = DB::table('ruleta_giros')
            ->where('usuario_id', $usuarioId)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->exists();

        if ($giroEsteMes) {
            $proximoMes = now()->startOfMonth()->addMonth()->format('d/m/Y');
            return response()->json([
                'puede'   => false,
                'mensaje' => "Ya usaste tu giro de este mes. Vuelve el $proximoMes.",
            ]);
        }

        return response()->json(['puede' => true]);
    }

    public function registrar(Request $request)
    {
        DB::table('ruleta_giros')->insert([
            'usuario_id' => $request->user()->id,
            'created_at' => now(),
        ]);

        return response()->json(['ok' => true]);
    }
}