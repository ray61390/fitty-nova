<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Descuento;
use Illuminate\Http\Request;

class DescuentoController extends Controller
{
    public function verificar(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
        ]);

        $descuento = Descuento::where('codigo', $request->codigo)
            ->where('activo', 1)
            ->first();

        if (!$descuento) {
            return response()->json(['message' => 'Cupón no válido'], 404);
        }

        if ($descuento->fecha_fin && $descuento->fecha_fin < now()) {
            return response()->json(['message' => 'El cupón ha expirado'], 422);
        }

        if ($descuento->usos_maximos && $descuento->usos_actuales >= $descuento->usos_maximos) {
            return response()->json(['message' => 'El cupón ha alcanzado el límite de usos'], 422);
        }

        return response()->json($descuento);
    }

    public function index(Request $request)
    {
        $descuentos = Descuento::where('vendedor_id', $request->user()->id)->get();
        return response()->json($descuentos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|string|max:150',
            'tipo'    => 'required|in:porcentaje,fijo',
            'valor'   => 'required|numeric|min:0',
            'codigo'  => 'nullable|string|unique:descuentos,codigo',
        ]);

        $descuento = Descuento::create([
            'vendedor_id'   => $request->user()->id,
            'nombre'        => $request->nombre,
            'tipo'          => $request->tipo,
            'valor'         => $request->valor,
            'codigo'        => $request->codigo,
            'activo'        => 1,
            'fecha_inicio'  => $request->fecha_inicio,
            'fecha_fin'     => $request->fecha_fin,
            'usos_maximos'  => $request->usos_maximos,
            'usos_actuales' => 0,
        ]);

        return response()->json($descuento, 201);
    }
}