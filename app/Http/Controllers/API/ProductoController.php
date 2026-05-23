<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\PedidoLinea;
class ProductoController extends Controller
{
public function index(Request $request)
{
    $query = Producto::with(['categoria', 'marca', 'imagenes']);

    if ($request->has('vendedor')) {
        $user = $request->user('sanctum');
        if ($user) {
            $query->where('vendedor_id', $user->id);
            return response()->json(['data' => $query->get()]);
        }
    }

    $query->where('activo', 1);

    if ($request->has('categoria_id')) {
        $query->where('categoria_id', $request->categoria_id);
    }

    if ($request->has('genero')) {
        $query->where('genero', $request->genero);
    }

    if ($request->has('buscar')) {
        $query->where('nombre', 'like', '%' . $request->buscar . '%');
    }

    $productos = $query->paginate(50);
    return response()->json($productos);
}
    public function show($id)
    {
        $producto = Producto::with(['categoria', 'marca', 'imagenes', 'variantes', 'resenas'])
            ->findOrFail($id);

        return response()->json($producto);
    }

    public function store(Request $request)
    {
        $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'nombre'       => 'required|string|max:200',
            'precio_base'  => 'required|numeric|min:0',
            'genero'       => 'in:hombre,mujer,unisex,niño',
        ]);

        $producto = Producto::create([
            'vendedor_id'  => $request->user()->id,
            'categoria_id' => $request->categoria_id,
            'marca_id'     => $request->marca_id,
            'nombre'       => $request->nombre,
            'slug'         => Str::slug($request->nombre) . '-' . uniqid(),
            'descripcion'  => $request->descripcion,
            'precio_base'  => $request->precio_base,
            'genero'       => $request->genero ?? 'unisex',
            'activo'       => 1,
            'destacado'    => 0,
        ]);

        return response()->json($producto, 201);
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::where('vendedor_id', $request->user()->id)
            ->findOrFail($id);

        $producto->update($request->only([
            'categoria_id', 'marca_id', 'nombre',
            'descripcion', 'precio_base', 'genero', 'activo', 'destacado'
        ]));

        return response()->json($producto);
    }

    public function destroy(Request $request, $id)
    {
        $producto = Producto::where('vendedor_id', $request->user()->id)
            ->findOrFail($id);

        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        $producto->imagenes()->delete();
        $producto->variantes()->delete();
        $producto->resenas()->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');

        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

public function tendencias()
{
    $productos = PedidoLinea::join('variantes', 'pedido_lineas.variante_id', '=', 'variantes.id')
        ->join('productos', 'variantes.producto_id', '=', 'productos.id')
        ->select('productos.id', \DB::raw('SUM(pedido_lineas.cantidad) as total_vendido'))
        ->where('productos.activo', 1)
        ->groupBy('productos.id')
        ->orderByDesc('total_vendido')
        ->limit(8)
        ->get()
        ->map(fn($item) => $item->id);

    $productosTop = Producto::with(['categoria', 'imagenes'])
        ->whereIn('id', $productos)
        ->get()
        ->sortBy(fn($p) => array_search($p->id, $productos->toArray()))
        ->values();

    return response()->json($productosTop);
}

}