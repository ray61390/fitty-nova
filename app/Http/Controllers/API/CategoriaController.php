<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::where('activa', 1)->get();
        return response()->json($categorias);
    }

    public function show($id)
    {
        $categoria = Categoria::with('productos')->findOrFail($id);
        return response()->json($categoria);
    }
}