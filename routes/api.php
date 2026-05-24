<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductoController;
use App\Http\Controllers\API\CategoriaController;
use App\Http\Controllers\API\ResenaController;
use App\Http\Controllers\API\PedidoController;
use App\Http\Controllers\API\ListaDeseosController;
use App\Http\Controllers\API\DevolucionController;
use App\Http\Controllers\API\DescuentoController;
use App\Http\Controllers\API\EstadisticasController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\ImagenController;
use App\Http\Controllers\API\VarianteController;
use App\Http\Controllers\API\RuletaController;
use App\Http\Controllers\API\PasswordResetController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
        Route::delete('/cuenta', [AuthController::class, 'eliminarCuenta']);
    });
});

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);

Route::get('/categorias',             [CategoriaController::class, 'index']);
Route::get('/categorias/{id}',        [CategoriaController::class, 'show']);

Route::post('/descuentos/verificar',  [DescuentoController::class, 'verificar']);

Route::get('/tendencias',             [ProductoController::class, 'tendencias']);
Route::get('/productos',              [ProductoController::class, 'index']);
Route::get('/productos/{id}/resenas', [ResenaController::class, 'index']);
Route::get('/productos/{id}',         [ProductoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/imagenes',              [ImagenController::class, 'store']);

    Route::post('/variantes',             [VarianteController::class, 'store']);
    Route::get('/variantes/{productoId}', [VarianteController::class, 'index']);
    Route::put('/variantes/{id}',         [VarianteController::class, 'update']);
    Route::delete('/variantes/{id}',      [VarianteController::class, 'destroy']);

    Route::post('/productos',             [ProductoController::class, 'store']);
    Route::put('/productos/{id}',         [ProductoController::class, 'update']);
    Route::delete('/productos/{id}',      [ProductoController::class, 'destroy']);

    Route::post('/productos/{id}/resenas', [ResenaController::class, 'store']);

    Route::get('/pedidos',                [PedidoController::class, 'index']);
    Route::get('/pedidos/vendedor',       [PedidoController::class, 'vendedor']);
    Route::get('/pedidos/{id}',           [PedidoController::class, 'show']);
    Route::post('/pedidos',               [PedidoController::class, 'store']);

    Route::get('/lista-deseos',           [ListaDeseosController::class, 'index']);
    Route::post('/lista-deseos',          [ListaDeseosController::class, 'store']);
    Route::delete('/lista-deseos/{id}',   [ListaDeseosController::class, 'destroy']);

    Route::get('/devoluciones',           [DevolucionController::class, 'index']);
    Route::post('/devoluciones',          [DevolucionController::class, 'store']);

    Route::get('/descuentos',             [DescuentoController::class, 'index']);
    Route::post('/descuentos',            [DescuentoController::class, 'store']);

    Route::get('/estadisticas/vendedor',  [EstadisticasController::class, 'vendedor']);
    Route::get('/estadisticas/admin',     [EstadisticasController::class, 'admin']);

    Route::get('/resenas/vendedor',       [ResenaController::class, 'vendedor']);
    Route::get('/resenas/cliente',        [ResenaController::class, 'cliente']);

    Route::get('/ruleta/puede-girar',     [RuletaController::class, 'puedeGirar']);
    Route::post('/ruleta/registrar',      [RuletaController::class, 'registrar']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/usuarios',               [AdminController::class, 'usuarios']);
    Route::get('/productos',              [AdminController::class, 'todosProductos']);
    Route::get('/pedidos',                [AdminController::class, 'pedidos']);
    Route::put('/pedidos/{id}',           [AdminController::class, 'actualizarPedido']);
});
