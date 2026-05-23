<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #020818; color: #fff; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: #0a1628; padding: 40px; border-radius: 8px; border: 1px solid rgba(99,179,237,0.2); }
        .logo { font-size: 24px; font-weight: bold; color: #63b3ed; margin-bottom: 24px; }
        .btn { display: inline-block; background: #63b3ed; color: #000; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 24px 0; }
        .footer { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">FITT-Y-NOVA</div>
        <h2>Recuperar contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el botón para continuar:</p>
        <a href="{{ $url }}" class="btn">Restablecer contraseña</a>
        <p class="footer">Este enlace expira en 60 minutos. Si no solicitaste esto, ignora este email.</p>
    </div>
</body>
</html>