<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\PedidoLinea;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    public function vendedor(Request $request)
    {
        $vendedorId = $request->user()->id;
        $productosIds = Producto::where('vendedor_id', $vendedorId)->pluck('id');

        $totalVentas = PedidoLinea::whereHas('variante', function ($q) use ($productosIds) {
            $q->whereIn('producto_id', $productosIds);
        })->sum('cantidad');

        $ingresos = PedidoLinea::whereHas('variante', function ($q) use ($productosIds) {
            $q->whereIn('producto_id', $productosIds);
        })->selectRaw('SUM(cantidad * precio_unit) as total')->value('total');

        $totalProductos = Producto::where('vendedor_id', $vendedorId)->count();

        // Producto más vendido
        $masVendidoData = PedidoLinea::join('variantes', 'pedido_lineas.variante_id', '=', 'variantes.id')
            ->whereIn('variantes.producto_id', $productosIds)
            ->select('variantes.producto_id', DB::raw('SUM(pedido_lineas.cantidad) as total_vendido'))
            ->groupBy('variantes.producto_id')
            ->orderByDesc('total_vendido')
            ->first();

        $productoMasVendido = null;
        if ($masVendidoData) {
            $prod = Producto::find($masVendidoData->producto_id);
            $productoMasVendido = [
                'nombre' => $prod?->nombre,
                'total_vendido' => $masVendidoData->total_vendido,
            ];
        }

        // Rendimiento por producto (top 5)
        $rendimiento = PedidoLinea::join('variantes', 'pedido_lineas.variante_id', '=', 'variantes.id')
            ->whereIn('variantes.producto_id', $productosIds)
            ->select(
                'variantes.producto_id',
                DB::raw('SUM(pedido_lineas.cantidad) as unidades'),
                DB::raw('SUM(pedido_lineas.cantidad * pedido_lineas.precio_unit) as ingresos')
            )
            ->groupBy('variantes.producto_id')
            ->orderByDesc('ingresos')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $prod = Producto::find($item->producto_id);
                return [
                    'nombre'   => $prod?->nombre,
                    'unidades' => $item->unidades,
                    'ingresos' => round($item->ingresos, 2),
                ];
            });

        return response()->json([
            'total_ventas'          => $totalVentas,
            'ingresos_totales'      => round($ingresos, 2),
            'total_productos'       => $totalProductos,
            'producto_mas_vendido'  => $productoMasVendido,
            'rendimiento'           => $rendimiento,
        ]);
    }

    public function admin(Request $request)
    {
        $totalVendedores = \App\Models\Usuario::whereHas('rol', function ($q) {
            $q->where('nombre', 'vendedor');
        })->count();

        $totalClientes = \App\Models\Usuario::whereHas('rol', function ($q) {
            $q->where('nombre', 'cliente');
        })->count();

        $totalProductos = Producto::count();
        $totalPedidos = Pedido::count();

        $ingresosTotales = Pedido::whereIn('estado', ['confirmado', 'enviado', 'entregado'])
            ->sum('total');

        $pedidosPorEstado = Pedido::select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->get();

        return response()->json([
            'total_vendedores'   => $totalVendedores,
            'total_clientes'     => $totalClientes,
            'total_productos'    => $totalProductos,
            'total_pedidos'      => $totalPedidos,
            'ingresos_totales'   => round($ingresosTotales, 2),
            'pedidos_por_estado' => $pedidosPorEstado,
        ]);
    }
}