<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #020818; color: #fff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { text-align: center; margin-bottom: 32px; }
        .logo h1 { font-size: 36px; letter-spacing: 8px; color: #63b3ed; margin: 0; }
        .card { background: #0a1628; border: 1px solid rgba(99,179,237,0.2); border-radius: 8px; padding: 40px; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #fff; }
        .text { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.7; margin-bottom: 24px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1a3a5c, #0d2137); color: #63b3ed; border: 1px solid rgba(99,179,237,0.3); padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; border-radius: 4px; }
        .footer { text-align: center; margin-top: 32px; color: rgba(255,255,255,0.3); font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>FITT-Y-NOVA</h1>
        </div>
        <div class="card">
            <p class="title">Bienvenid@ a Fitt-y-Nova, {{ $nombre }}</p>
            <p class="text">
                Tu cuenta ha sido creada correctamente. Ya puedes explorar nuestra colección, 
                guardar tus prendas favoritas y girar la ruleta para conseguir descuentos exclusivos.
            </p>
            <p class="text">
                Estamos encantados de tenerte con nosotros.
            </p>
            <a href="{{ config('app.url') }}" class="btn">Ir a la tienda</a>
        </div>
        <div class="footer">
            <p> 2026 Fitt-y-Nova · Fashion Flow Passion</p>
        </div>
    </div>
</body>
</html>
