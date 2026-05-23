<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Pedido;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function usuarios()
    {
        $usuarios = Usuario::with('rol')
            ->whereHas('rol', function ($q) {
                $q->whereIn('nombre', ['cliente', 'vendedor']);
            })
            ->orderBy('rol_id')
            ->orderBy('nombre')
            ->get();

        return response()->json($usuarios);
    }

    public function pedidos()
    {
        $pedidos = Pedido::with(['cliente', 'lineas'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pedidos);
    }

    public function actualizarPedido(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,confirmado,enviado,entregado,cancelado,devuelto',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update(['estado' => $request->estado]);

        return response()->json($pedido);
    }
}