<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');
        
        if ($request->isMethod('POST') || $request->isMethod('PUT')) {
            $request->headers->set('Content-Type', 'application/json');
        }
        
        return $next($request);
    }
}